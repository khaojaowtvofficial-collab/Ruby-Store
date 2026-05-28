/* =========================================================
   Ruby Store — db.js  (Cloud-first with localStorage fallback)

   Data layers:
   ① Write-through cache: every write goes to localStorage immediately,
     then async to Supabase
   ② On page load: fetch from Supabase → update localStorage cache
   ③ If Supabase is unreachable: read from localStorage

   Tables in Supabase:
   - orders   (customers place orders)
   - products (admin manages catalog)
   - settings (store names, logos, etc.)
   ========================================================= */

'use strict';

// ── SUPABASE CONFIG ──────────────────────────────────────
const SUPABASE_URL      = 'https://wqxzobxqkwyrffvibdxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeHpvYnhxa3d5cmZmdmliZHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzIzMjIsImV4cCI6MjA5NTIwODMyMn0.5KcfdZF9uZ1XsgmtRAIiVKAGin7L-mlPaQ958p2GqqU';
// ─────────────────────────────────────────────────────────

let _sb = null;
let _sdkLoaded = false;

async function _loadSDK() {
  if (_sdkLoaded || window.supabase?.createClient) { _sdkLoaded = true; return; }
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = () => { _sdkLoaded = true; res(); };
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function _getSB() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (_sb) return _sb;
  await _loadSDK();
  _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _sb;
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

function getShortUID() {
  return getUID().slice(-8).toUpperCase();
}

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

function _rowToProduct(row) {
  const images = Array.isArray(row.images) ? row.images : (row.img_url ? [row.img_url] : []);
  return {
    id:       row.id,
    name:     row.name,
    price:    row.price,
    oldPrice: row.old_price || undefined,
    store:    row.store,
    cat:      row.cat,
    badge:    row.badge || undefined,
    bg:       row.bg || '#FFF5F5',
    emoji:    row.emoji || '📦',
    imgUrl:   images[0] || row.img_url || undefined,
    images,
    desc:     row.description || undefined,
    brand:    row.brand || undefined,
    specs:    row.specs || undefined,
    stock:    typeof row.stock === 'number' ? row.stock : 0,
    variants: Array.isArray(row.variants) ? row.variants : [],
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
  if (idx >= 0) orders[idx] = order;
  else orders.unshift(order);
  localStorage.setItem('ruby_orders', JSON.stringify(orders.slice(0, 200)));
}

async function saveOrder(orderData) {
  const order = {
    ...orderData,
    uid:       getUID(),
    status:    'pending',
    createdAt: new Date().toISOString(),
  };

  // Always save locally first
  _pushLocalOrder(order);
  localStorage.setItem('ruby_last_order', JSON.stringify(order));

  // Sync to Supabase
  const sb = await _getSB();
  if (sb) {
    const { error } = await sb.from('orders').insert({
      uid:      order.uid,
      order_no: order.orderNo,
      name:     order.name,
      phone:    order.phone,
      address:  order.address,
      delivery: order.delivery,
      channel:  order.channel,
      note:     order.note || '',
      items:    order.items,
      total:    order.total,
      status:   'pending',
    });
    if (error) console.warn('[RubyDB] Order sync error:', error.message);
    else       console.log('[RubyDB] Order synced ✓', order.orderNo);
  }

  return order;
}

async function fetchMyOrders() {
  const sb = await _getSB();
  if (sb) {
    const { data, error } = await sb
      .from('orders')
      .select('*')
      .eq('uid', getUID())
      .order('created_at', { ascending: false });
    if (!error && data?.length) return data.map(_rowToOrder);
  }
  return _getLocalOrders();
}

async function fetchAllOrders(limit = 300) {
  const sb = await _getSB();
  if (!sb) return null;
  const { data, error } = await sb
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.warn('[RubyDB] fetchAllOrders error:', error.message); return null; }
  // Also update local cache
  const orders = data.map(_rowToOrder);
  localStorage.setItem('ruby_orders', JSON.stringify(orders));
  return orders;
}

// Update by order_no (not UUID)
async function updateOrderStatus(orderNo, status) {
  // Update local immediately
  const local = _getLocalOrders();
  const idx = local.findIndex(o => o.orderNo === orderNo);
  if (idx >= 0) { local[idx].status = status; localStorage.setItem('ruby_orders', JSON.stringify(local)); }

  // Update Supabase
  const sb = await _getSB();
  if (!sb) return false;
  const { error } = await sb.from('orders').update({ status }).eq('order_no', orderNo);
  if (error) { console.warn('[RubyDB] updateOrderStatus error:', error.message); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════

async function fetchProducts() {
  const sb = await _getSB();
  if (sb) {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) {
      const prods = data.map(_rowToProduct);
      localStorage.setItem('ruby_products', JSON.stringify(prods));
      window.PRODUCTS = prods;
      return prods;
    }
  }
  // Fallback: localStorage or default
  const local = localStorage.getItem('ruby_products');
  if (local) try { const p = JSON.parse(local); if (p.length) return p; } catch(e) {}
  return window.PRODUCTS || [];
}

async function saveProduct(product) {
  // Update local cache immediately
  _upsertLocalProduct(product);

  const sb = await _getSB();
  if (sb) {
    const row = _productToRow(product);
    let { error } = await sb.from('products').upsert(row, { onConflict: 'id' });
    if (error && error.code === '42703') {
      // Column doesn't exist yet — retry without newer fields
      const { stock, variants, images, brand, specs, ...rowFallback } = row;
      ({ error } = await sb.from('products').upsert(rowFallback, { onConflict: 'id' }));
      if (!error) console.log('[RubyDB] Product saved (partial — run schema migration) ✓', product.id);
    }
    if (error) console.warn('[RubyDB] saveProduct error:', error.message);
    else       console.log('[RubyDB] Product saved ✓', product.id);
  }
}

async function deleteProduct(id) {
  // Remove from local cache immediately
  const prods = JSON.parse(localStorage.getItem('ruby_products') || '[]').filter(p => p.id !== id);
  localStorage.setItem('ruby_products', JSON.stringify(prods));
  window.PRODUCTS = prods;

  const sb = await _getSB();
  if (sb) {
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) console.warn('[RubyDB] deleteProduct error:', error.message);
    else       console.log('[RubyDB] Product deleted ✓', id);
  }
}

function _upsertLocalProduct(product) {
  const prods = JSON.parse(localStorage.getItem('ruby_products') || '[]');
  const idx = prods.findIndex(p => p.id === product.id);
  if (idx >= 0) prods[idx] = product;
  else prods.push(product);
  localStorage.setItem('ruby_products', JSON.stringify(prods));
  window.PRODUCTS = prods;
}

// ═══════════════════════════════════════════════════════
//  SETTINGS  (store names, logos, etc.)
// ═══════════════════════════════════════════════════════

// key examples: 'store_name_pet', 'store_logo_pet'
async function saveSetting(key, value) {
  // Save to localStorage immediately (with ruby_ prefix for backward compat)
  localStorage.setItem('ruby_' + key, value);

  const sb = await _getSB();
  if (sb) {
    const { error } = await sb.from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) console.warn('[RubyDB] saveSetting error:', error.message);
    else       console.log('[RubyDB] Setting saved ✓', key);
  }
}

async function fetchSettings() {
  const sb = await _getSB();
  if (sb) {
    const { data, error } = await sb.from('settings').select('*');
    if (!error && data) {
      const settings = {};
      data.forEach(row => {
        settings[row.key] = row.value;
        // Sync to localStorage with ruby_ prefix
        localStorage.setItem('ruby_' + row.key, row.value);
      });
      return settings;
    }
  }
  // Fallback: read from localStorage
  const settings = {};
  ['store_name_pet','store_name_computer','store_name_toy',
   'store_logo_pet','store_logo_computer','store_logo_toy',
   'store_bg_pet','store_bg_computer','store_bg_toy'].forEach(key => {
    const v = localStorage.getItem('ruby_' + key);
    if (v) settings[key] = v;
  });
  return settings;
}

// ── IS CLOUD CONFIGURED? ─────────────────────────────────
function isCloudEnabled() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ── EXPOSE GLOBALLY ──────────────────────────────────────
window.RubyDB = {
  getUID,
  getShortUID,
  isCloudEnabled,
  // Orders
  saveOrder,
  fetchMyOrders,
  fetchAllOrders,
  updateOrderStatus,
  getLocalOrders: _getLocalOrders,
  // Products
  fetchProducts,
  saveProduct,
  deleteProduct,
  // Settings
  saveSetting,
  fetchSettings,
};
