/* =========================================================
   Ruby Store — db.js  (Direct REST API — no SDK required)

   ใช้ Supabase REST API ผ่าน fetch() โดยตรง
   ไม่โหลด SDK จาก CDN → เร็วกว่า, เสถียรกว่า ใน mobile
   ========================================================= */

'use strict';

const SUPABASE_URL      = 'https://wqxzobxqkwyrffvibdxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeHpvYnhxa3d5cmZmdmliZHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzIzMjIsImV4cCI6MjA5NTIwODMyMn0.5KcfdZF9uZ1XsgmtRAIiVKAGin7L-mlPaQ958p2GqqU';

const _H = {
  'apikey':        SUPABASE_ANON_KEY,
  'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type':  'application/json',
};

// ── CORE REST HELPER ─────────────────────────────────────
// บาง ISP/เครือข่ายบล็อก *.supabase.co — ถ้ายิงตรงไม่ได้ จะสลับไปยิงผ่าน
// same-origin proxy (/sb → rewrite ใน vercel.json) ให้อัตโนมัติ
const SUPABASE_PROXY = '/sb';
let _apiBase = SUPABASE_URL;

// เครือข่ายบางที่ "ดูด" connection เงียบๆ (ไม่ reject ทันที) — ใส่ timeout
// เพื่อให้ล้มเร็วภายใน 8 วิ แล้วสลับไป proxy ได้ทันที แทนที่จะค้างเป็นนาที
const _FETCH_TIMEOUT_MS = 8000;
function _fetchTimeout(url, opts) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), _FETCH_TIMEOUT_MS);
  return fetch(url, Object.assign({}, opts, { signal: ctrl.signal }))
    .finally(() => clearTimeout(t));
}

async function _rest(method, path, body, extra) {
  const opts = {
    method:  method,
    headers: Object.assign({}, _H, extra || {}),
    body:    body ? JSON.stringify(body) : undefined,
  };
  let res;
  try {
    res = await _fetchTimeout(_apiBase + '/rest/v1/' + path, opts);
  } catch(e) {
    // Network-level failure (DNS/firewall/timeout) — retry once through our own domain
    if (_apiBase !== SUPABASE_PROXY && location.protocol.indexOf('http') === 0) {
      res = await _fetchTimeout(SUPABASE_PROXY + '/rest/v1/' + path, opts);
      _apiBase = SUPABASE_PROXY;   // stick with the proxy for later calls
      console.log('[RubyDB] Direct connection blocked — switched to /sb proxy');
    } else {
      throw e;
    }
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => res.status);
    throw new Error('[RubyDB] ' + method + ' ' + path + ' → ' + res.status + ' ' + txt);
  }
  if (res.status === 204) return null;
  // Supabase replies 200/201 with an empty body when 'Prefer: return=minimal'
  // is set — guard against "Unexpected end of JSON input" on empty responses.
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch(e) { return null; }
}

// ── ANONYMOUS USER ID ────────────────────────────────────
function getUID() {
  let uid = localStorage.getItem('ruby_uid');
  if (!uid) {
    uid = 'rb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('ruby_uid', uid);
  }
  return uid;
}
function getShortUID() { return getUID().slice(-8).toUpperCase(); }

// ── ROW NORMALISERS ──────────────────────────────────────
function _rowToOrder(row) {
  return {
    id:        row.id,
    orderNo:   row.order_no,
    name:      row.name,
    phone:     row.phone,
    address:   row.address,
    delivery:  row.delivery,
    channel:   row.channel,
    note:      row.note,
    items:     row.items || [],
    itemsStr:  Array.isArray(row.items) ? row.items.map(i => `${i.name} x${i.qty}`).join(', ') : '-',
    total:     row.total || 0,
    status:    row.status,
    uid:       row.uid,
    createdAt: row.created_at,
    date:      row.created_at
      ? new Date(row.created_at).toLocaleString('lo-LA', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
      : '-',
  };
}

const _STORE_NAMES = { pet: 'Ruby Pet Shop', computer: 'Ruby Computer', toy: 'Ruby Toy Shop' };

function _rowToProduct(row) {
  const images = Array.isArray(row.images) ? row.images : (row.img_url ? [row.img_url] : []);
  return {
    id:        row.id,
    name:      row.name,
    price:     row.price,
    oldPrice:  row.old_price || undefined,
    store:     row.store,
    storeName: localStorage.getItem('ruby_store_name_' + row.store) || _STORE_NAMES[row.store] || row.store,
    cat:       row.cat,
    badge:     row.badge || undefined,
    bg:        row.bg || '#FFF5F5',
    emoji:     row.emoji || '📦',
    imgUrl:    images[0] || row.img_url || undefined,
    images,
    desc:      row.description || undefined,
    brand:     row.brand || undefined,
    specs:     row.specs || undefined,
    stock:     typeof row.stock === 'number' ? row.stock : 0,
    variants:  Array.isArray(row.variants) ? row.variants : [],
  };
}

function _productToRow(p) {
  return {
    id:          p.id,
    name:        p.name,
    price:       p.price,
    old_price:   p.oldPrice || null,
    store:       p.store,
    cat:         p.cat || null,
    badge:       p.badge || null,
    bg:          p.bg || '#FFF5F5',
    emoji:       p.emoji || '📦',
    img_url:     (p.images && p.images[0]) || p.imgUrl || null,
    images:      p.images || [],
    description: p.desc || null,
    brand:       p.brand || null,
    specs:       p.specs || null,
    stock:       p.stock || 0,
    variants:    p.variants || [],
    updated_at:  new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════

function _getLocalOrders() {
  return JSON.parse(localStorage.getItem('ruby_orders') || '[]');
}
function _pushLocalOrder(order) {
  const orders = _getLocalOrders();
  const idx = orders.findIndex(o => o.orderNo === order.orderNo);
  if (idx >= 0) orders[idx] = order; else orders.unshift(order);
  localStorage.setItem('ruby_orders', JSON.stringify(orders.slice(0, 200)));
}

async function saveOrder(orderData) {
  const order = { ...orderData, uid: getUID(), status: 'pending', createdAt: new Date().toISOString() };
  _pushLocalOrder(order);
  localStorage.setItem('ruby_last_order', JSON.stringify(order));
  try {
    await _rest('POST', 'orders', {
      uid: order.uid, order_no: order.orderNo, name: order.name,
      phone: order.phone, address: order.address, delivery: order.delivery,
      channel: order.channel, note: order.note || '', items: order.items,
      total: order.total, status: 'pending',
    });
    console.log('[RubyDB] Order synced ✓', order.orderNo);
  } catch(e) { console.warn('[RubyDB] saveOrder:', e.message); }
  return order;
}

async function fetchMyOrders() {
  try {
    const data = await _rest('GET', `orders?uid=eq.${getUID()}&order=created_at.desc`);
    if (data && data.length) return data.map(_rowToOrder);
  } catch(e) { console.warn('[RubyDB] fetchMyOrders:', e.message); }
  return _getLocalOrders();
}

async function fetchAllOrders(limit = 300) {
  try {
    const data = await _rest('GET', `orders?order=created_at.desc&limit=${limit}`);
    if (data) {
      const orders = data.map(_rowToOrder);
      localStorage.setItem('ruby_orders', JSON.stringify(orders));
      return orders;
    }
  } catch(e) { console.warn('[RubyDB] fetchAllOrders:', e.message); }
  return null;
}

async function updateOrderStatus(orderNo, status) {
  const local = _getLocalOrders();
  const idx = local.findIndex(o => o.orderNo === orderNo);
  if (idx >= 0) { local[idx].status = status; localStorage.setItem('ruby_orders', JSON.stringify(local)); }
  try {
    await _rest('PATCH', `orders?order_no=eq.${encodeURIComponent(orderNo)}`, { status });
    return true;
  } catch(e) { console.warn('[RubyDB] updateOrderStatus:', e.message); return false; }
}

// ═══════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════

// Fetch listing data — img_url is now a tiny thumbnail (150px) generated by Admin
// Full images[] are only fetched by fetchProductById() for the detail page
const _PROD_LIST_COLS = 'id,name,price,old_price,store,cat,badge,bg,emoji,img_url,description,brand,specs,stock,variants,created_at';

async function fetchProducts() {
  try {
    const data = await _rest('GET', `products?select=${_PROD_LIST_COLS}&order=created_at.asc`);
    if (data && data.length) {
      // Restore images from existing localStorage cache (Admin saved them there)
      let cachedMap = {};
      try {
        const cached = JSON.parse(localStorage.getItem('ruby_products') || '[]');
        cached.forEach(function(p) { cachedMap[p.id] = p; });
      } catch(e) {}

      const prods = data.map(function(row) {
        const p = _rowToProduct(row);
        const c = cachedMap[p.id];
        if (c) {
          if (c.imgUrl  && !p.imgUrl)  p.imgUrl  = c.imgUrl;
          if (c.images  && !p.images.length) p.images = c.images;
        }
        return p;
      });
      localStorage.setItem('ruby_products', JSON.stringify(prods));
      window.PRODUCTS = prods;
      return prods;
    }
  } catch(e) {
    console.warn('[RubyDB] fetchProducts:', e.message);
    window.RUBY_LAST_PRODUCTS_ERROR = e.message;
  }
  // Fallback: localStorage → window.PRODUCTS
  const local = localStorage.getItem('ruby_products');
  if (local) try { const p = JSON.parse(local); if (p.length) return p; } catch(e) {}
  return window.PRODUCTS || [];
}

// Fetch single product — lightweight first (fast), then enrich with images
async function fetchProductById(id) {
  // Step 1: fast fetch (listing cols ~5KB) — so user can interact immediately
  try {
    const data = await _rest('GET', `products?id=eq.${encodeURIComponent(id)}&select=${_PROD_LIST_COLS}`);
    if (data && data.length) {
      const p = _rowToProduct(data[0]);
      // Restore cached images if available
      try {
        const cached = JSON.parse(localStorage.getItem('ruby_products') || '[]');
        const c = cached.find(x => x.id === id);
        if (c) {
          if (c.imgUrl && !p.imgUrl) p.imgUrl = c.imgUrl;
          if (c.images && c.images.length) p.images = c.images;
        }
      } catch(e) {}
      return p;
    }
  } catch(e) { console.warn('[RubyDB] fetchProductById:', e.message); }
  return null;
}

// Fetch full product including images[] (call separately for gallery rendering)
async function fetchProductImages(id) {
  try {
    const data = await _rest('GET', `products?id=eq.${encodeURIComponent(id)}&select=id,img_url,images`);
    if (data && data.length) return { imgUrl: data[0].img_url, images: data[0].images || [] };
  } catch(e) { console.warn('[RubyDB] fetchProductImages:', e.message); }
  return null;
}

async function saveProduct(product) {
  _upsertLocalProduct(product);
  const row = _productToRow(product);
  try {
    await _rest('POST', 'products', row, { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
    console.log('[RubyDB] Product saved ✓', product.id);
  } catch(e) {
    // Retry without new columns if schema mismatch
    if (e.message.includes('42703') || e.message.includes('column')) {
      const { stock, variants, images, brand, specs, ...fallback } = row;
      try {
        await _rest('POST', 'products', fallback, { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
        console.log('[RubyDB] Product saved (partial) ✓', product.id);
      } catch(e2) { console.warn('[RubyDB] saveProduct fallback:', e2.message); }
    } else { console.warn('[RubyDB] saveProduct:', e.message); }
  }
}

async function deleteProduct(id) {
  const prods = JSON.parse(localStorage.getItem('ruby_products') || '[]').filter(p => p.id !== id);
  localStorage.setItem('ruby_products', JSON.stringify(prods));
  window.PRODUCTS = prods;
  try {
    await _rest('DELETE', `products?id=eq.${encodeURIComponent(id)}`);
    console.log('[RubyDB] Product deleted ✓', id);
  } catch(e) { console.warn('[RubyDB] deleteProduct:', e.message); }
}

function _upsertLocalProduct(product) {
  const prods = JSON.parse(localStorage.getItem('ruby_products') || '[]');
  const idx = prods.findIndex(p => p.id === product.id);
  if (idx >= 0) prods[idx] = product; else prods.push(product);
  localStorage.setItem('ruby_products', JSON.stringify(prods));
  window.PRODUCTS = prods;
}

// ═══════════════════════════════════════════════════════
//  SALES  (POS checkout records — shared across devices)
// ═══════════════════════════════════════════════════════

function _getLocalSales() {
  try { return JSON.parse(localStorage.getItem('ruby_sales') || '[]'); } catch(e) { return []; }
}
function _pushLocalSale(sale) {
  const sales = _getLocalSales();
  const idx = sales.findIndex(s => s.id === sale.id);
  if (idx >= 0) sales[idx] = sale; else sales.unshift(sale);
  localStorage.setItem('ruby_sales', JSON.stringify(sales.slice(0, 500)));
  return sales;
}

// Save a POS sale — writes to local cache immediately, then syncs to cloud
// so other devices/staff see it too. Falls back gracefully if offline.
async function saveSale(sale) {
  _pushLocalSale(sale);
  try {
    await _rest('POST', 'sales', {
      id: sale.id, date: sale.date, items: sale.items,
      subtotal: sale.subtotal, discount: sale.discount, total: sale.total,
      cashier: sale.cashier || null,
    }, { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
    console.log('[RubyDB] Sale synced ✓', sale.id);
  } catch(e) { console.warn('[RubyDB] saveSale:', e.message); }
  return sale;
}

// Fetch all sales (cloud first so every device/cashier sees the same history,
// fallback to local cache when offline)
async function fetchSales(limit = 500) {
  try {
    const data = await _rest('GET', `sales?order=date.desc&limit=${limit}`);
    if (data) {
      const sales = data.map(row => ({
        id: row.id, date: row.date, items: row.items || [],
        subtotal: row.subtotal || 0, discount: row.discount || 0,
        total: row.total || 0, cashier: row.cashier || undefined,
      }));
      localStorage.setItem('ruby_sales', JSON.stringify(sales));
      return sales;
    }
  } catch(e) { console.warn('[RubyDB] fetchSales:', e.message); }
  return _getLocalSales();
}

// Clear all sales history — cloud + local
async function clearSales() {
  localStorage.removeItem('ruby_sales');
  try {
    await _rest('DELETE', 'sales?id=gt.0');
    console.log('[RubyDB] Sales history cleared ✓');
  } catch(e) { console.warn('[RubyDB] clearSales:', e.message); }
}

// ═══════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════

async function saveSetting(key, value) {
  localStorage.setItem('ruby_' + key, value);
  try {
    await _rest('POST', 'settings', { key, value, updated_at: new Date().toISOString() },
      { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
    console.log('[RubyDB] Setting saved ✓', key);
  } catch(e) { console.warn('[RubyDB] saveSetting:', e.message); }
}

async function fetchSettings() {
  try {
    const data = await _rest('GET', 'settings?select=*');
    if (data) {
      const settings = {};
      data.forEach(row => {
        settings[row.key] = row.value;
        localStorage.setItem('ruby_' + row.key, row.value);
      });
      return settings;
    }
  } catch(e) { console.warn('[RubyDB] fetchSettings:', e.message); }
  // Fallback from localStorage
  const settings = {};
  [
    'store_name_pet','store_name_computer','store_name_toy',
    'store_logo_pet','store_logo_computer','store_logo_toy',
    'store_bg_pet','store_bg_computer','store_bg_toy',
    'hero_intro_bg','hero_intro_title','hero_intro_sub','hero_intro_img',
    'hero_pet_title','hero_pet_sub','hero_pet_img',
    'hero_comp_title','hero_comp_sub','hero_comp_img',
    'hero_toy_title','hero_toy_sub','hero_toy_img',
  ].forEach(key => {
    const v = localStorage.getItem('ruby_' + key);
    if (v) settings[key] = v;
  });
  return settings;
}

// Fetch products + settings in parallel
async function fetchAll() {
  const [prods, settings] = await Promise.all([fetchProducts(), fetchSettings()]);
  return { prods, settings };
}

// ── CLOUD ENABLED CHECK ──────────────────────────────────
function isCloudEnabled() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ── EXPOSE GLOBALLY ──────────────────────────────────────
window.RubyDB = {
  getUID, getShortUID, isCloudEnabled,
  saveOrder, fetchMyOrders, fetchAllOrders, updateOrderStatus,
  getLocalOrders: _getLocalOrders,
  fetchProducts, fetchProductById, fetchProductImages, saveProduct, deleteProduct,
  saveSetting, fetchSettings, fetchAll,
  saveSale, fetchSales, clearSales, getLocalSales: _getLocalSales,
};
