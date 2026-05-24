/* =========================================================
   Ruby Store — db.js
   Anonymous identity + Order history (no login required)

   How it works:
   1. Browser gets a unique ID (UUID) on first visit → saved to localStorage
   2. Every order is saved locally (works immediately, no setup)
   3. If Supabase is configured → orders also sync to cloud
      (customer can see history across devices via Order No)

   Setup Supabase (optional):
   1. Go to https://supabase.com → create free project
   2. Open SQL Editor → paste & run schema.sql
   3. Copy Project URL + anon key → fill in below
   ========================================================= */

'use strict';

// ── SUPABASE CONFIG ──────────────────────────────────────
// Leave blank to use localStorage only (works fine without this)
const SUPABASE_URL     = '';  // 'https://xxxxxxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = ''; // 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'

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
// Stable per-browser identity — no login required
function getUID() {
  let uid = localStorage.getItem('ruby_uid');
  if (!uid) {
    uid = 'rb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('ruby_uid', uid);
  }
  return uid;
}

// Short display version (last 8 chars)
function getShortUID() {
  return getUID().slice(-8).toUpperCase();
}

// ── LOCAL ORDER HISTORY ──────────────────────────────────
function _getLocalOrders() {
  return JSON.parse(localStorage.getItem('ruby_orders') || '[]');
}

function _pushLocalOrder(order) {
  const orders = _getLocalOrders();
  const idx = orders.findIndex(o => o.orderNo === order.orderNo);
  if (idx >= 0) orders[idx] = order;   // update existing
  else orders.unshift(order);           // prepend newest
  localStorage.setItem('ruby_orders', JSON.stringify(orders.slice(0, 100)));
}

// ── SAVE ORDER ───────────────────────────────────────────
// Called from checkout after user confirms
async function saveOrder(orderData) {
  const order = {
    ...orderData,
    uid: getUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // 1. Always save locally (instant, no network needed)
  _pushLocalOrder(order);
  localStorage.setItem('ruby_last_order', JSON.stringify(order));

  // 2. Sync to Supabase if configured
  const sb = await _getSB();
  if (sb) {
    const { error } = await sb.from('orders').insert({
      uid:        order.uid,
      order_no:   order.orderNo,
      name:       order.name,
      phone:      order.phone,
      address:    order.address,
      delivery:   order.delivery,
      channel:    order.channel,
      note:       order.note || '',
      items:      order.items,
      total:      order.total,
      status:     'pending',
    });
    if (error) console.warn('[RubyDB] Supabase insert error:', error.message);
    else       console.log('[RubyDB] Order synced to cloud ✓', order.orderNo);
  }

  return order;
}

// ── FETCH MY ORDERS (customer profile) ──────────────────
async function fetchMyOrders() {
  const sb = await _getSB();
  if (sb) {
    const { data, error } = await sb
      .from('orders')
      .select('*')
      .eq('uid', getUID())
      .order('created_at', { ascending: false });
    if (!error && data?.length) {
      // Normalise column names to camelCase
      return data.map(_rowToOrder);
    }
  }
  return _getLocalOrders();
}

// ── FETCH ALL ORDERS (admin dashboard) ──────────────────
async function fetchAllOrders(limit = 100) {
  const sb = await _getSB();
  if (!sb) return null;  // null = Supabase not configured
  const { data, error } = await sb
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.warn('[RubyDB] fetchAllOrders error:', error.message); return null; }
  return data.map(_rowToOrder);
}

// ── UPDATE ORDER STATUS (admin) ──────────────────────────
async function updateOrderStatus(id, status) {
  const sb = await _getSB();
  if (!sb) return false;
  const { error } = await sb.from('orders').update({ status }).eq('id', id);
  return !error;
}

// ── ROW NORMALISER ───────────────────────────────────────
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
    items:     row.items,
    total:     row.total,
    status:    row.status,
    uid:       row.uid,
    createdAt: row.created_at,
  };
}

// ── IS SUPABASE CONFIGURED? ──────────────────────────────
function isCloudEnabled() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ── EXPOSE GLOBALLY ──────────────────────────────────────
window.RubyDB = {
  getUID,
  getShortUID,
  isCloudEnabled,
  saveOrder,
  fetchMyOrders,
  fetchAllOrders,
  updateOrderStatus,
  getLocalOrders: _getLocalOrders,
};
