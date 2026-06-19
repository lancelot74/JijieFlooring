/* Catalogue: render grid, combinable filters, lightbox with deep-linking.
   Depends on window.PRODUCTS (assets/js/products.js). */
(function () {
  var P = window.PRODUCTS || [];
  var grid = document.getElementById('catgrid');
  if (!grid) return;

  var WECHAT = '13819223555';
  var INSTAGRAM = 'https://instagram.com/chinajijiefloor';

  var SPECIES_ORDER = ['Oak', 'Teak', 'Black Walnut', 'Ash', 'Wenge', 'Rosewood', 'Birch'];
  var FAMILY_ORDER = ['Versailles', 'Princess Anne', 'Octagon Star', 'Diamond', 'Checkerboard', 'Lotus', 'Leaf', 'Chinese Knot', 'Pentagon', 'Floral'];
  var COLLECTIONS = [['geometric', 'Classic Geometric'], ['artistic', 'Artistic Inlay']];
  var COLL_LABEL = { geometric: 'Classic Geometric Parquet', artistic: 'Artistic Shaped Inlay' };

  var state = { collection: 'all', family: 'all', species: 'all' };
  var view = []; // current filtered list

  // ---- read filters from URL hash (e.g. #species=Oak, #collection=geometric) ----
  var openSlug = null;
  (function readHash() {
    var h = location.hash.replace(/^#/, '');
    if (!h) return;
    h.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      var k = decodeURIComponent(kv[0] || '');
      var v = decodeURIComponent(kv[1] || '');
      if (k === 'species' && SPECIES_ORDER.indexOf(v) > -1) state.species = v;
      else if (k === 'family' && FAMILY_ORDER.indexOf(v) > -1) state.family = v;
      else if (k === 'collection' && (v === 'geometric' || v === 'artistic')) state.collection = v;
      else if (k === 'p') openSlug = v;
    });
  })();

  // ---- build filter chip rows ----
  function chip(group, value, label, active) {
    var b = document.createElement('button');
    b.className = 'fbtn' + (active ? ' is-active' : '');
    b.dataset.group = group; b.dataset.value = value;
    b.textContent = label;
    b.addEventListener('click', function () {
      state[group] = (state[group] === value) ? 'all' : value;
      if (value === 'all') state[group] = 'all';
      render();
    });
    return b;
  }

  function buildFilters() {
    var c = document.getElementById('f-collection');
    var f = document.getElementById('f-family');
    var s = document.getElementById('f-species');
    c.appendChild(chip('collection', 'all', 'All', state.collection === 'all'));
    COLLECTIONS.forEach(function (x) { c.appendChild(chip('collection', x[0], x[1], state.collection === x[0])); });
    f.appendChild(chip('family', 'all', 'All', state.family === 'all'));
    FAMILY_ORDER.forEach(function (x) { f.appendChild(chip('family', x, x, state.family === x)); });
    s.appendChild(chip('species', 'all', 'All', state.species === 'all'));
    SPECIES_ORDER.forEach(function (x) { s.appendChild(chip('species', x, x, state.species === x)); });
  }

  function syncChips() {
    document.querySelectorAll('.fbtn').forEach(function (b) {
      b.classList.toggle('is-active', state[b.dataset.group] === b.dataset.value);
    });
  }

  function match(p) {
    return (state.collection === 'all' || p.collection === state.collection)
      && (state.family === 'all' || p.family === state.family)
      && (state.species === 'all' || p.species === state.species);
  }

  function render() {
    view = P.filter(match);
    syncChips();
    grid.innerHTML = '';
    if (!view.length) {
      grid.innerHTML = '<div class="no-results">No patterns match this combination. <button class="clearbtn" id="clear2">Clear filters</button></div>';
      document.getElementById('clear2').addEventListener('click', clearAll);
    } else {
      var frag = document.createDocumentFragment();
      view.forEach(function (p, i) {
        var btn = document.createElement('button');
        btn.className = 'pcard';
        btn.setAttribute('aria-label', 'View ' + p.name);
        btn.innerHTML =
          '<div class="pcard__img"><img loading="lazy" src="assets/img/grid/' + p.slug + '.jpg" alt="' + p.name + ' parquet flooring"></div>' +
          '<div class="pcard__cap"><span class="n">' + p.name + '</span><span class="c">No. ' + p.code + '</span></div>' +
          '<div class="pcard__sp">' + p.species + '</div>';
        btn.addEventListener('click', function () { openLightbox(i); });
        frag.appendChild(btn);
      });
      grid.appendChild(frag);
    }
    var cnt = document.getElementById('count');
    if (cnt) cnt.innerHTML = '<b>' + view.length + '</b> of ' + P.length + ' patterns';
  }

  function clearAll() { state = { collection: 'all', family: 'all', species: 'all' }; render(); }
  var clearBtn = document.getElementById('clear');
  if (clearBtn) clearBtn.addEventListener('click', clearAll);

  // ---- Lightbox ----
  var lb = document.getElementById('lb');
  var idx = -1;
  function openLightbox(i) {
    idx = i; var p = view[i]; if (!p) return;
    lb.querySelector('#lb-img').src = 'assets/img/detail/' + p.slug + '.jpg';
    lb.querySelector('#lb-img').alt = p.name + ' parquet flooring';
    lb.querySelector('#lb-fam').textContent = p.family;
    lb.querySelector('#lb-name').textContent = p.name;
    lb.querySelector('#lb-code').textContent = 'No. ' + p.code;
    lb.querySelector('#lb-collection').textContent = COLL_LABEL[p.collection];
    lb.querySelector('#lb-family').textContent = p.family;
    lb.querySelector('#lb-species').textContent = p.species;
    lb.querySelector('#lb-ref').textContent = p.code;
    lb.classList.add('open');
    document.body.classList.add('menu-open'); // lock scroll
    setHash('#p=' + p.slug);
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.classList.remove('menu-open');
    setHash('');
  }
  // replaceState can throw on file:// in some browsers — fail silently there.
  function setHash(h) {
    try { history.replaceState(null, '', h || location.pathname); }
    catch (e) { /* file:// — ignore */ }
  }
  function step(d) { var n = idx + d; if (n < 0) n = view.length - 1; if (n >= view.length) n = 0; openLightbox(n); }

  if (lb) {
    lb.querySelector('.lb__scrim').addEventListener('click', closeLightbox);
    lb.querySelector('.lb__close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb__nav.prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb__nav.next').addEventListener('click', function () { step(1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
    // Inquiry buttons
    lb.querySelector('#lb-ig').href = INSTAGRAM;
    lb.querySelector('#lb-wechat').addEventListener('click', function () {
      var btn = this;
      var done = function () {
        var t = btn.querySelector('.lbl'); var old = t.textContent;
        t.textContent = 'Copied ✓'; setTimeout(function () { t.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WECHAT).then(done, function () { window.location.href = 'contact.html'; });
      } else { window.location.href = 'contact.html'; }
    });
  }

  // ---- init ----
  buildFilters();
  render();
  if (openSlug) {
    var pos = view.findIndex(function (p) { return p.slug === openSlug; });
    if (pos > -1) openLightbox(pos);
  }
})();
