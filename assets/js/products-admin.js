/* Hand-managed by the secret admin page (jiadminjie123.html).
   Do NOT edit by hand — the admin page reads and rewrites the JSON on the next line.
   `adds`  = products added via the admin page (same shape as products.js, + optional size/name_zh)
   `hidden`= slugs hidden from the catalogue (delete = add slug here; restore = remove it). */
window.__ADMIN_DATA = {"adds":[],"hidden":[]};
window.PRODUCTS = (window.PRODUCTS || []).concat(window.__ADMIN_DATA.adds);
window.HIDDEN_PRODUCTS = (window.HIDDEN_PRODUCTS || []).concat(window.__ADMIN_DATA.hidden);
