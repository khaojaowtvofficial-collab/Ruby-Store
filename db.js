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
async function _rest(method, path, body, extra) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    method:  method,
    headers: Object.assign({}, _H, extra || {}),
    body:    body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.status);
    throw new Error('[RubyDB] ' + method + ' ' + path + ' → ' + res.status + ' ' + txt);
  }
  if (res.status === 204) return null;
  return res.json();
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

// Fetch listing data ONLY (no images — keeps payload ~2KB instead of 3MB+)
// Images are restored from localStorage cache; product detail fetches separately
const _PROD_LIST_COLS = 'id,name,price,old_price,store,cat,badge,bg,emoji,description,brand,specs,stock,variants,created_at';

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
  } catch(e) { console.warn('[RubyDB] fetchProducts:', e.message); }
  // Fallback: localStorage → window.PRODUCTS
  const local = localStorage.getItem('ruby_products');
  if (local) try { const p = JSON.parse(local); if (p.length) return p; } catch(e) {}
  return window.PRODUCTS || [];
}

// Full product with all images (for product detail page)
async function fetchProductById(id) {
  try {
    const data = await _rest('GET', `products?id=eq.${encodeURIComponent(id)}&select=*`);
    if (data && data.length) return _rowToProduct(data[0]);
  } catch(e) { console.warn('[RubyDB] fetchProductById:', e.message); }
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
  fetchProducts, fetchProductById, saveProduct, deleteProduct,
  saveSetting, fetchSettings, fetchAll,
};
