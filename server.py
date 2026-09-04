"""Static file server for the Sleepwell screens.

Serves the directory this file lives in. The port comes from $PORT, falling
back to 4321.

  PORT 4321 IS RESERVED for this server. Leave the running instance alone and
  do not hand the port to another service. If a start fails with "port in
  use", health-check the existing one and reuse it instead of killing it:

      curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:4321/index.html

  Need a second instance? PORT=4399 python3 server.py — 4321 stays untouched.

Two macOS details this works around:

* ~/Documents is TCC-protected. A process without Documents access gets
  PermissionError from os.getcwd(), which SimpleHTTPRequestHandler calls on
  every request, so the root is passed to the handler explicitly instead.

* The server must ride through system sleep. Processes are suspended rather
  than killed and the loopback socket survives, but a single-threaded server
  wedges behind any one held-open connection, which looks identical to having
  died. Threading the handler plus retrying interrupted accepts keeps it
  answering after a wake.

Run it detached so it outlives the shell that started it:

    nohup python3 server.py > /tmp/sleepwell-server.log 2>&1 &
"""
import errno
import functools
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "4321"))


class Server(socketserver.ThreadingTCPServer):
    """Threaded so one slow or held-open connection can't block the rest."""

    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 64

    def handle_error(self, request, client_address):
        # A dropped connection across a sleep/wake is routine, not a crash.
        exc = sys.exc_info()[1]
        if isinstance(exc, (ConnectionResetError, BrokenPipeError)):
            return
        super().handle_error(request, client_address)


class Handler(http.server.SimpleHTTPRequestHandler):
    """Never let the browser cache a screen.

    SimpleHTTPRequestHandler sends Last-Modified but no Cache-Control, so
    Chrome caches heuristically and serves stale HTML without revalidating —
    edits appear not to have landed, and a newly linked screen still shows the
    old href. Fine for a dev server to disable caching outright.
    """

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


handler = functools.partial(Handler, directory=ROOT)

with Server(("127.0.0.1", PORT), handler) as httpd:
    print("serving %s on http://127.0.0.1:%d" % (ROOT, PORT), flush=True)
    while True:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("shutting down", flush=True)
            break
        except OSError as exc:
            # Waking from sleep can interrupt the accept loop; resume rather
            # than exit, or the server appears to have died overnight.
            if exc.errno in (errno.EINTR, errno.EAGAIN):
                continue
            raise
