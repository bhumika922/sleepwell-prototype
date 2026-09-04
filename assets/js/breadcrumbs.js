/* Breadcrumbs overlay — Figma node 1733:17258.
 *
 * Long-pressing any back button opens the trail with a way home. Shared
 * because the design says "any screen": the markup is injected here rather
 * than pasted into every page, so there is one copy to change.
 *
 * The trail is static. Screens hold no state, so there is no real history to
 * read; these are the design's own entries. Wire it to a router later.
 */
(function () {
  'use strict';

  var TRAIL = ['Revital 4.0', 'Eminence', 'Spinetech Air Luxury', 'Spinetech Air'];
  var HOLD = 450;   // ms before a press counts as a long press
  var SLOP = 10;    // px of movement that cancels it, so scrolling never fires

  var backs = document.querySelectorAll(
    '.bd-actions__back, .mx-actions__back, .sel-actions__back'
  );
  if (!backs.length) return;

  // --- overlay ---------------------------------------------------------

  var overlay = document.createElement('div');
  overlay.className = 'overlay crumbs';
  overlay.id = 'crumbs';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Breadcrumbs');

  var items = TRAIL.map(function (name, i) {
    var current = i === TRAIL.length - 1;
    return '<li class="crumbs__item' + (current ? ' crumbs__item--current' : '') + '"' +
           (current ? ' aria-current="page"' : '') + '>' + name + '</li>';
  }).join('');

  overlay.innerHTML =
    '<ul class="crumbs__list">' + items + '</ul>' +
    '<div class="crumbs__bar">' +
      '<button class="crumbs__close" type="button" aria-label="Close breadcrumbs">' +
        '<img src="assets/icons/x-32.svg" alt="" />' +
      '</button>' +
      '<a class="crumbs__home" href="index.html">' +
        '<img src="assets/icons/home-16.svg" alt="" />Back to home' +
      '</a>' +
    '</div>';

  document.body.appendChild(overlay);

  function open() { overlay.hidden = false; }
  function close() { overlay.hidden = true; }

  overlay.querySelector('.crumbs__close').addEventListener('click', close);

  // Close on any click that is not on the content itself. Testing
  // `e.target === overlay` is not enough: the list stretches the full width,
  // so a click in the dark area beside a chip lands on the list, not the
  // overlay, and would be ignored.
  overlay.addEventListener('click', function (e) {
    if (!e.target.closest('.crumbs__item, .crumbs__bar')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  // --- long press ------------------------------------------------------

  [].forEach.call(backs, function (back) {
    var timer = null, startX = 0, startY = 0, fired = false;

    function cancel() { clearTimeout(timer); timer = null; }

    back.addEventListener('pointerdown', function (e) {
      fired = false;
      startX = e.clientX;
      startY = e.clientY;
      timer = setTimeout(function () {
        fired = true;
        open();
      }, HOLD);
    });

    back.addEventListener('pointermove', function (e) {
      if (timer && (Math.abs(e.clientX - startX) > SLOP ||
                    Math.abs(e.clientY - startY) > SLOP)) cancel();
    });

    back.addEventListener('pointerup', cancel);
    back.addEventListener('pointercancel', cancel);
    back.addEventListener('pointerleave', cancel);

    // a long press must not also follow the back link
    back.addEventListener('click', function (e) {
      if (fired) { e.preventDefault(); fired = false; }
    });

    // and it must not raise the OS text-selection menu
    back.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
}());
