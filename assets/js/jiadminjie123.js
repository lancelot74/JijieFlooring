/* Secret catalogue admin (jiadminjie123.html).
   Passphrase gate (client-side hash = obscurity only) → paste a GitHub token (stored in this
   browser only) → add / delete products by committing to the repo via the GitHub Contents API.
   Add  = commit grid jpg + detail jpg + updated products-admin.js.
   Delete = add slug to the hide-list in products-admin.js (restore = remove it). */
(function () {
  'use strict';

  // ---- config ----
  var REPO = 'lancelot74/JijieFlooring';
  var BRANCH = 'main';
  var REPO_URL = 'https://api.github.com/repos/' + REPO;
  var API = REPO_URL + '/contents/';
  var ADMIN_PATH = 'assets/js/products-admin.js';
  var GRID_DIR = 'assets/img/grid/';
  var DETAIL_DIR = 'assets/img/detail/';
  var PASS_HASH = '6c0065fdeced3b414a690eb02aa035ae7e8dbc99e1b9867dd5d882a3817ba1a6';

  var COLLECTIONS = [['geometric', 'Classic Geometric'], ['artistic', 'Artistic Inlay'], ['plank', 'Herringbone, Chevron & Plank']];
  var FAMILIES = ['Versailles', 'Princess Anne', 'Octagon Star', 'Diamond', 'Checkerboard', 'Lotus', 'Leaf', 'Chinese Knot', 'Pentagon', 'Floral', 'Herringbone', 'Chevron', 'Sawtooth', 'Long Plank', 'Shaped Inlay'];
  var SPECIES = ['Oak', 'Teak', 'Black Walnut', 'Ash', 'Wenge', 'Rosewood', 'Birch'];

  // ---- state ----
  var token = '';
  var adminData = { adds: [], hidden: [] }; // authoritative copy of products-admin.js
  var adminSha = null;                       // its current sha (null = file does not exist yet)
  var gridCanvas = null, detailCanvas = null;

  // ===== tiny helpers =====
  function $(id) { return document.getElementById(id); }
  function show(el, on) { el.hidden = !on; }
  function escHtml(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function utf8ToB64(str) { return btoa(unescape(encodeURIComponent(str))); }
  function b64ToUtf8(b64) { return decodeURIComponent(escape(atob((b64 || '').replace(/\s/g, '')))); }

  // Self-contained SHA-256 (no crypto.subtle, so it works in any context: http, file://, LAN IP).
  function sha256hex(ascii) {
    function rotr(n, x) { return (x >>> n) | (x << (32 - n)); }
    var K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var utf8 = unescape(encodeURIComponent(ascii)), bytes = [], i, t, off;
    for (i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i) & 0xff);
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    bytes.push(0, 0, 0, 0, (bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);
    var w = new Array(64);
    for (off = 0; off < bytes.length; off += 64) {
      for (t = 0; t < 16; t++)
        w[t] = ((bytes[off + t * 4] << 24) | (bytes[off + t * 4 + 1] << 16) | (bytes[off + t * 4 + 2] << 8) | (bytes[off + t * 4 + 3])) | 0;
      for (t = 16; t < 64; t++) {
        var s0 = rotr(7, w[t - 15]) ^ rotr(18, w[t - 15]) ^ (w[t - 15] >>> 3);
        var s1 = rotr(17, w[t - 2]) ^ rotr(19, w[t - 2]) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + K[t] + w[t]) | 0;
        var S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var hex = '';
    for (i = 0; i < 8; i++) hex += ('00000000' + (H[i] >>> 0).toString(16)).slice(-8);
    return hex;
  }

  function sanitize(s) { return (s || '').replace(/[{}\[\];\\]/g, '').replace(/\s+/g, ' ').trim(); }
  function slugify(s) { return (s || '').toLowerCase().replace(/[·]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  function genProducts() { return window.__GEN_PRODUCTS || []; }
  function displayProducts() { return genProducts().concat(adminData.adds); }
  function isHidden(slug) { return adminData.hidden.indexOf(slug) !== -1; }

  function uniqueSlug(base) {
    var taken = {};
    displayProducts().forEach(function (p) { taken[p.slug] = true; });
    if (!base) base = 'product';
    var s = base, i = 2;
    while (taken[s]) { s = base + '-' + i; i++; }
    return s;
  }

  // ===== GitHub API =====
  function authHeaders() {
    return { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  }
  function ghGet(path) {
    return fetch(API + path + '?ref=' + BRANCH, { headers: authHeaders(), cache: 'no-store' }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('GitHub read failed (' + r.status + ')');
      return r.json();
    });
  }
  function ghPut(path, b64, message, sha) {
    var body = { message: message, content: b64, branch: BRANCH };
    if (sha) body.sha = sha;
    return fetch(API + path, {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('GitHub write failed (' + r.status + '): ' + t.slice(0, 160)); });
      return r.json();
    });
  }
  // create-or-update a file, fetching its current sha first
  function putFile(path, b64, message) {
    return ghGet(path).then(function (cur) { return ghPut(path, b64, message, cur ? cur.sha : null); });
  }

  // ===== products-admin.js read / write =====
  function serializeAdmin() {
    var json = JSON.stringify({ adds: adminData.adds, hidden: adminData.hidden });
    return [
      '/* Hand-managed by the secret admin page (jiadminjie123.html).',
      '   Do NOT edit by hand — the admin page reads and rewrites the JSON on the next line.',
      '   `adds`  = products added via the admin page (same shape as products.js, + optional size/name_zh)',
      '   `hidden`= slugs hidden from the catalogue (delete = add slug here; restore = remove it). */',
      'window.__ADMIN_DATA = ' + json + ';',
      'window.PRODUCTS = (window.PRODUCTS || []).concat(window.__ADMIN_DATA.adds);',
      'window.HIDDEN_PRODUCTS = (window.HIDDEN_PRODUCTS || []).concat(window.__ADMIN_DATA.hidden);',
      ''
    ].join('\n');
  }
  function parseAdmin(text) {
    var m = text.match(/__ADMIN_DATA\s*=\s*(\{[\s\S]*?\});/);
    if (!m) return { adds: [], hidden: [] };
    try { var d = JSON.parse(m[1]); return { adds: d.adds || [], hidden: d.hidden || [] }; }
    catch (e) { return { adds: [], hidden: [] }; }
  }
  // pull the authoritative file + sha from GitHub (fallback: the copy loaded in this page)
  function refreshAdmin() {
    return ghGet(ADMIN_PATH).then(function (cur) {
      if (cur) { adminSha = cur.sha; adminData = parseAdmin(b64ToUtf8(cur.content)); }
      else {
        adminSha = null;
        var d = window.__ADMIN_DATA || {};
        adminData = { adds: (d.adds || []).slice(), hidden: (d.hidden || []).slice() };
      }
    });
  }
  // refresh → apply mutation to the latest state → commit; retry once on a conflict
  function withAdmin(mutate, message) {
    return refreshAdmin().then(function () {
      mutate(adminData);
      return ghPut(ADMIN_PATH, utf8ToB64(serializeAdmin()), message, adminSha);
    }).then(function (res) {
      adminSha = res.content.sha;
    }).catch(function (e) {
      if (!/\((409|422)\)/.test(e.message)) throw e;
      return refreshAdmin().then(function () {
        mutate(adminData);
        return ghPut(ADMIN_PATH, utf8ToB64(serializeAdmin()), message, adminSha);
      }).then(function (res) { adminSha = res.content.sha; });
    });
  }

  // ===== image processing (one upload → grid + detail) =====
  function fileToImage(file) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error('could not read image')); };
      img.src = URL.createObjectURL(file);
    });
  }
  function makeGrid(img) { // 500×500 centre-crop
    var S = 500, c = document.createElement('canvas'); c.width = S; c.height = S;
    var side = Math.min(img.width, img.height);
    var sx = (img.width - side) / 2, sy = (img.height - side) / 2;
    c.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, S, S);
    return c;
  }
  function makeDetail(img) { // longest side ≤ 1000
    var MAX = 1000, scale = Math.min(1, MAX / Math.max(img.width, img.height));
    var c = document.createElement('canvas');
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  function canvasToB64(c, q) { return c.toDataURL('image/jpeg', q).split(',')[1]; }

  // ===== operations =====
  function doAdd(product, gridB64, detailB64) {
    return putFile(GRID_DIR + product.slug + '.jpg', gridB64, 'Add image ' + product.slug + ' (grid)')
      .then(function () { return putFile(DETAIL_DIR + product.slug + '.jpg', detailB64, 'Add image ' + product.slug + ' (detail)'); })
      .then(function () {
        return withAdmin(function (d) {
          if (!d.adds.some(function (p) { return p.slug === product.slug; })) d.adds.push(product);
          var hi = d.hidden.indexOf(product.slug); if (hi > -1) d.hidden.splice(hi, 1);
        }, 'Add product ' + product.slug);
      });
  }
  function doDelete(slug) {
    return withAdmin(function (d) {
      var ai = d.adds.findIndex(function (p) { return p.slug === slug; });
      if (ai > -1) { // admin-added → remove outright (also drop any hide entry)
        d.adds.splice(ai, 1);
        var hi = d.hidden.indexOf(slug); if (hi > -1) d.hidden.splice(hi, 1);
      } else if (d.hidden.indexOf(slug) === -1) { // generated → hide
        d.hidden.push(slug);
      }
    }, 'Hide product ' + slug);
  }
  function doRestore(slug) {
    return withAdmin(function (d) {
      var i = d.hidden.indexOf(slug); if (i > -1) d.hidden.splice(i, 1);
    }, 'Restore product ' + slug);
  }

  // ===== UI: gate =====
  function unlock() {
    show($('gate'), false);
    show($('app'), true);
    token = localStorage.getItem('gh_token') || '';
    if (token) enterTools(); else show($('token-setup'), true);
  }
  $('gate-form').addEventListener('submit', function (e) {
    e.preventDefault();
    try {
      if (sha256hex($('pass').value) === PASS_HASH) { sessionStorage.setItem('adm_ok', '1'); unlock(); }
      else { $('gate-err').textContent = 'Wrong passphrase.'; }
    } catch (err) { $('gate-err').textContent = 'Error: ' + err.message; }
  });

  // ===== UI: token =====
  function enterTools() {
    show($('token-setup'), false);
    show($('tools'), true);
    $('token-badge').innerHTML = 'token saved <button type="button" id="tok-clear">change</button>';
    $('tok-clear').addEventListener('click', function () {
      localStorage.removeItem('gh_token'); token = '';
      show($('tools'), false); $('token-badge').textContent = '';
      $('token-input').value = ''; $('token-status').textContent = '';
      show($('token-setup'), true);
    });
    fillSelects();
    refreshAdmin().then(renderList).catch(function (e) { setStatus('manage-status', 'Could not load products: ' + e.message, true); });
  }
  $('token-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = $('token-input').value.trim();
    if (!t) return;
    $('token-status').textContent = 'Checking token…'; $('token-status').className = 'status err';
    token = t;
    fetch(REPO_URL, { headers: authHeaders(), cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status === 401 ? 'Token rejected (401). Check it and try again.' : 'GitHub error (' + r.status + ').');
      localStorage.setItem('gh_token', token);
      $('token-status').textContent = '';
      enterTools();
    }).catch(function (err) { token = ''; $('token-status').textContent = err.message; });
  });

  // ===== UI: tabs =====
  $('tab-btn-add').addEventListener('click', function () { switchTab('add'); });
  $('tab-btn-manage').addEventListener('click', function () { switchTab('manage'); });
  function switchTab(which) {
    $('tab-btn-add').classList.toggle('on', which === 'add');
    $('tab-btn-manage').classList.toggle('on', which === 'manage');
    show($('tab-add'), which === 'add');
    show($('tab-manage'), which === 'manage');
    if (which === 'manage') renderList();
  }

  // ===== UI: add =====
  function fillSelects() {
    var sel = $('f-collection');
    sel.innerHTML = COLLECTIONS.map(function (c) { return '<option value="' + c[0] + '">' + escHtml(c[1]) + '</option>'; }).join('');
    $('dl-family').innerHTML = FAMILIES.map(function (f) { return '<option value="' + escHtml(f) + '">'; }).join('');
    $('dl-species').innerHTML = SPECIES.map(function (s) { return '<option value="' + escHtml(s) + '">'; }).join('');
  }
  $('f-photo').addEventListener('change', function () {
    var file = this.files && this.files[0];
    if (!file) return;
    fileToImage(file).then(function (img) {
      gridCanvas = makeGrid(img);
      detailCanvas = makeDetail(img);
      var pv = $('preview'); pv.innerHTML = ''; pv.appendChild(gridCanvas);
      URL.revokeObjectURL(img.src);
      setStatus('add-status', '');
    }).catch(function () { setStatus('add-status', 'Could not read that image.', true); });
  });
  $('add-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!gridCanvas || !detailCanvas) { setStatus('add-status', 'Choose a photo first.', true); return; }
    var name = sanitize($('f-name').value);
    if (!name) { setStatus('add-status', 'Name is required.', true); return; }
    var code = sanitize($('f-code').value) || ('A' + (adminData.adds.length + 1));
    var slug = uniqueSlug(slugify(name) + (slugify(code) ? '-' + slugify(code) : ''));
    var product = {
      slug: slug, name: name, code: code,
      collection: $('f-collection').value,
      family: sanitize($('f-family').value),
      species: sanitize($('f-species').value)
    };
    var size = sanitize($('f-size').value); if (size) product.size = size;
    var zh = sanitize($('f-namezh').value); if (zh) product.name_zh = zh;

    setStatus('add-status', 'Publishing… this takes a few seconds.');
    $('add-submit').disabled = true;
    doAdd(product, canvasToB64(gridCanvas, 0.82), canvasToB64(detailCanvas, 0.85)).then(function () {
      setStatus('add-status', '✓ Added “' + name + '” (slug: ' + slug + '). Live in about a minute.', false, true);
      $('add-form').reset(); $('preview').innerHTML = ''; gridCanvas = detailCanvas = null;
    }).catch(function (err) {
      setStatus('add-status', 'Error: ' + err.message, true);
    }).then(function () { $('add-submit').disabled = false; });
  });

  // ===== UI: manage =====
  $('search').addEventListener('input', renderList);
  function renderList() {
    var q = $('search').value.toLowerCase();
    var items = displayProducts().filter(function (p) {
      if (!q) return true;
      return (p.name + ' ' + p.code + ' ' + p.collection + ' ' + (p.species || '') + ' ' + (p.family || '')).toLowerCase().indexOf(q) > -1;
    });
    $('list-count').textContent = items.length + (items.length === 1 ? ' product' : ' products');
    var wrap = $('prod-list'); wrap.innerHTML = '';
    items.forEach(function (p) {
      var hidden = isHidden(p.slug);
      var row = document.createElement('div');
      row.className = 'prow' + (hidden ? ' is-hidden' : '');
      row.innerHTML =
        '<img class="pthumb" loading="lazy" src="' + GRID_DIR + escHtml(p.slug) + '.jpg" alt="" onerror="this.style.visibility=\'hidden\'">' +
        '<div class="pmeta"><div class="pn">' + escHtml(p.name) + '</div>' +
        '<div class="pc">No. ' + escHtml(p.code) + ' · ' + escHtml(p.collection) + (p.species ? ' · ' + escHtml(p.species) : '') + '</div></div>' +
        (hidden ? '<span class="badge">hidden</span>' : '') +
        '<button class="rowbtn ' + (hidden ? 'restore' : 'del') + '" data-slug="' + escHtml(p.slug) + '">' + (hidden ? 'Restore' : 'Delete') + '</button>';
      wrap.appendChild(row);
    });
  }
  $('prod-list').addEventListener('click', function (e) {
    var b = e.target.closest('.rowbtn'); if (!b) return;
    var slug = b.dataset.slug, restore = b.classList.contains('restore');
    if (!restore && !confirm('Hide “' + slug + '” from the catalogue?')) return;
    b.disabled = true; b.textContent = '…';
    (restore ? doRestore(slug) : doDelete(slug)).then(function () {
      setStatus('manage-status', '✓ Saved. Live in about a minute.', false, true);
      renderList();
    }).catch(function (err) {
      setStatus('manage-status', 'Error: ' + err.message, true);
      b.disabled = false; b.textContent = restore ? 'Restore' : 'Delete';
    });
  });

  function setStatus(id, msg, isErr, isOk) {
    var el = $(id); el.textContent = msg;
    el.className = 'status' + (isErr ? ' err' : '') + (isOk ? ' ok' : '');
  }

  // ===== boot =====
  if (sessionStorage.getItem('adm_ok') === '1') unlock();
})();
