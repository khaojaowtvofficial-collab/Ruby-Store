/* =========================================================
   Ruby Store — app.js
   Vanilla JS: cart, WA modal, helpers, products data
   ========================================================= */

'use strict';

/* ─── PRODUCT DATA ─────────────────────────────────────── */
window.PRODUCTS = [
  {
    id: 'P001',
    name: 'Royal Canin Adult 15kg',
    price: 1290,
    oldPrice: 1490,
    store: 'pet',
    storeName: 'Ruby Pet Shop',
    cat: 'food',
    emoji: '🐾',
    bg: '#FFF1F1',
    badge: 'sale',
    rating: 4.8,
    reviews: 124,
    desc: 'อาหารสุนัขสูตรสำหรับสุนัขโตทุกสายพันธุ์ ขนาด 15 กิโลกรัม เต็มไปด้วยโปรตีนคุณภาพสูง',
    details: 'โปรตีน 25% ไขมัน 12% ไฟเบอร์ 3.8% เหมาะสำหรับสุนัขอายุ 1-7 ปี',
  },
  {
    id: 'P002',
    name: 'Whiskas ปลาแซลมอน 1.2kg',
    price: 299,
    oldPrice: null,
    store: 'pet',
    storeName: 'Ruby Pet Shop',
    cat: 'food',
    emoji: '🐱',
    bg: '#FFF8F1',
    badge: 'new',
    rating: 4.6,
    reviews: 89,
    desc: 'อาหารแมวรสปลาแซลมอน สูตรพิเศษบำรุงขน ขนาด 1.2 กิโลกรัม',
    details: 'โปรตีน 30% ไขมัน 11% ไฟเบอร์ 2.5% ปราศจากสารกันบูด',
  },
  {
    id: 'P003',
    name: 'Kong Classic ขนาด M',
    price: 490,
    oldPrice: null,
    store: 'pet',
    storeName: 'Ruby Pet Shop',
    cat: 'toy-pet',
    emoji: '🎾',
    bg: '#F1FFF4',
    badge: null,
    rating: 4.9,
    reviews: 56,
    desc: 'ของเล่นยางสำหรับสุนัข ทนทาน ใส่อาหารได้ ช่วยฝึกสมอง ขนาด M',
    details: 'วัสดุยางธรรมชาติ ปลอดสาร BPA ล้างน้ำได้ น้ำหนัก 120g',
  },
  {
    id: 'P004',
    name: 'ไม้ตกปลาแมว พร้อมขนนก',
    price: 189,
    oldPrice: 250,
    store: 'pet',
    storeName: 'Ruby Pet Shop',
    cat: 'toy-pet',
    emoji: '🪶',
    bg: '#F5F1FF',
    badge: 'sale',
    rating: 4.7,
    reviews: 203,
    desc: 'ของเล่นไม้ตกปลาแมวพร้อมขนนกสีสันสวยงาม ยาว 60 ซม. กระตุ้นสัญชาตญาณนักล่า',
    details: 'ความยาวด้าม 45 ซม. สาย 15 ซม. วัสดุ: ไม้ + ขนสังเคราะห์',
  },
  {
    id: 'P005',
    name: 'Mechanical Keyboard RGB TKL',
    price: 2490,
    oldPrice: 2990,
    store: 'computer',
    storeName: 'Ruby Computer',
    cat: 'computer',
    emoji: '⌨️',
    bg: '#F1F5FF',
    badge: 'sale',
    rating: 4.8,
    reviews: 312,
    desc: 'คีย์บอร์ด Mechanical สวิตช์ Brown ไฟ RGB แบบ TKL ไม่มี Numpad ประหยัดพื้นที่',
    details: 'Switch: Brown | Layout: TKL | RGB: Per-key | Interface: USB-C | Weight: 780g',
  },
  {
    id: 'P006',
    name: 'Gaming Mouse 16000 DPI',
    price: 890,
    oldPrice: null,
    store: 'computer',
    storeName: 'Ruby Computer',
    cat: 'equip',
    emoji: '🖱️',
    bg: '#F1FFF9',
    badge: 'new',
    rating: 4.7,
    reviews: 178,
    desc: 'เมาส์เกมมิ่ง ความละเอียดสูงถึง 16000 DPI พร้อมไฟ RGB 7 สี รองรับมือขวา',
    details: 'DPI: 200-16000 | ปุ่ม: 7 ปุ่ม | สาย: 1.8m braided | น้ำหนัก: 85g',
  },
  {
    id: 'P007',
    name: 'LEGO Classic 500 ชิ้น',
    price: 1290,
    oldPrice: 1490,
    store: 'toy',
    storeName: 'Ruby Toy Shop',
    cat: 'toy',
    emoji: '🧱',
    bg: '#FFFBF1',
    badge: 'sale',
    rating: 4.9,
    reviews: 441,
    desc: 'LEGO Classic ชุดใหญ่ 500 ชิ้น หลากสีสัน เหมาะสำหรับเด็กอายุ 4+ ปี',
    details: 'จำนวน: 500 ชิ้น | อายุ: 4+ ปี | ขนาดกล่อง: 38×28×18 ซม.',
  },
  {
    id: 'P008',
    name: 'ตุ๊กตาหมีน้อย 30cm',
    price: 350,
    oldPrice: null,
    store: 'toy',
    storeName: 'Ruby Toy Shop',
    cat: 'toy',
    emoji: '🧸',
    bg: '#FFF1F8',
    badge: 'new',
    rating: 4.8,
    reviews: 267,
    desc: 'ตุ๊กตาหมีน้อยผ้านุ่ม ขนาด 30 ซม. ล้างได้ เนื้อผ้าเรียบนุ่ม ปลอดภัยสำหรับเด็ก',
    details: 'ขนาด: 30 ซม. | วัสดุ: ผ้าฝ้าย 100% | ซักได้ | อายุ: 0+ ปี',
  },
];

/* ─── MERGE ADMIN PRODUCT OVERRIDES ────────────────────── */
/* ถ้า Admin แก้ไข/เพิ่มสินค้า จะ save ลง ruby_products    */
/* ทุกหน้าจะใช้ข้อมูลจาก localStorage แทน hardcoded list  */
(function () {
  try {
    const override = localStorage.getItem('ruby_products');
    if (override) {
      const parsed = JSON.parse(override);
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.PRODUCTS = parsed;
      }
    }
  } catch (e) { /* ignore parse errors */ }
})();

/* ─── CART STATE ────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('ruby_cart') || '[]');

function saveCart() {
  localStorage.setItem('ruby_cart', JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(productId, qty = 1, variant = null) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const key = variant ? `${productId}|${variant}` : productId;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      bg: product.bg,
      store: product.store,
      storeName: product.storeName,
      variant,
      qty,
    });
  }
  saveCart();
  updateCartUI();
  showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`, 'success');
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
  renderCartItems();
}

/* ─── CART UI ───────────────────────────────────────────── */
function updateCartUI() {
  const count = getCartCount();
  // Desktop badge
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }
  // Mobile dot
  const dot = document.getElementById('mobileCartDot');
  if (dot) dot.classList.toggle('visible', count > 0);
  // Cart totals
  const sub = getCartTotal();
  const subEl = document.getElementById('cartSubtotalVal');
  const totEl = document.getElementById('cartTotalVal');
  if (subEl) subEl.textContent = '฿' + sub.toLocaleString();
  if (totEl) totEl.textContent = '฿' + sub.toLocaleString();
  // Footer visibility
  const footer = document.getElementById('cartFooter');
  if (footer) footer.style.display = cart.length ? 'block' : 'none';
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  const empty = document.getElementById('cartEmpty');

  if (cart.length === 0) {
    if (empty) empty.style.display = 'flex';
    // Remove any item rows
    el.querySelectorAll('.cart-item').forEach(n => n.remove());
    return;
  }
  if (empty) empty.style.display = 'none';

  // Re-render all items
  el.querySelectorAll('.cart-item').forEach(n => n.remove());
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.key = item.key;
    div.innerHTML = `
      <div class="cart-item-img" style="background:${item.bg || '#F5F5F5'}">${item.emoji || '🛍️'}</div>
      <div class="cart-item-body">
        <div class="cart-item-name">${item.name}</div>
        ${(item.variant && item.variant !== 'undefined') ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
        <div class="cart-item-price">฿${item.price.toLocaleString()}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty('${item.key}', -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.key}', 1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart('${item.key}')">🗑</button>
        </div>
      </div>`;
    el.appendChild(div);
  });
}

function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── TOAST ─────────────────────────────────────────────── */
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

/* ─── NAVBAR SCROLL ─────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── HAMBURGER ─────────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  // close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

/* ─── CART BUTTON BINDINGS ──────────────────────────────── */
function initCartButtons() {
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('mobileCartBtn')?.addEventListener('click', e => {
    e.preventDefault();
    openCart();
  });
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
}

/* ─── PRODUCT CARD BUILDER ──────────────────────────────── */
// NOTE: use hash (#P001) not query param — npx serve strips query strings
function buildProductCard(p) {
  const badgeHtml = p.badge
    ? `<span class="product-badge ${p.badge}">${p.badge === 'new' ? '✨ ใหม่' : '🏷️ Sale'}</span>`
    : '';
  const oldPriceHtml = p.oldPrice
    ? `<span style="text-decoration:line-through;color:var(--muted);font-size:0.8rem;font-weight:400;">฿${p.oldPrice.toLocaleString()}</span>`
    : '';
  return `
    <div class="product-card" data-id="${p.id}">
      <a href="product.html#${p.id}" class="product-img" style="background:${p.bg};text-decoration:none;">
        ${badgeHtml}
        <span style="font-size:3rem;">${p.emoji}</span>
      </a>
      <div class="product-body">
        <div class="product-store">${p.storeName}</div>
        <a href="product.html#${p.id}" class="product-name" style="text-decoration:none;color:inherit;">${p.name}</a>
        <div class="product-price">
          ฿${p.price.toLocaleString()} ${oldPriceHtml}
        </div>
        <button class="product-add-btn" onclick="addToCart('${p.id}')">+ ใส่ตะกร้า</button>
      </div>
    </div>`;
}

function bindAddToCart() {
  // Already handled via onclick in buildProductCard
}

/* ─── WA MODAL ──────────────────────────────────────────── */
const WA_NUMBER = '8562078926245'; // shop WA number
const MSG_LINK = 'https://m.me/rubystore';

function buildOrderMessage(form) {
  const name = form?.name || 'ลูกค้า';
  const phone = form?.phone || '-';
  const address = form?.address || '-';
  const delivery = form?.delivery || 'ส่งพัสดุ';
  const note = form?.note || '-';

  let lines = ['🛍️ *สั่งซื้อจาก Ruby Store*\n'];
  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name}${item.variant ? ` (${item.variant})` : ''} x${item.qty} = ฿${(item.price * item.qty).toLocaleString()}`);
  });
  lines.push('');
  lines.push(`💰 รวม: ฿${getCartTotal().toLocaleString()}`);
  lines.push(`🚚 จัดส่ง: ${delivery}`);
  lines.push('');
  lines.push(`👤 ชื่อ: ${name}`);
  lines.push(`📞 โทร: ${phone}`);
  lines.push(`📍 ที่อยู่: ${address}`);
  if (note && note !== '-') lines.push(`📝 หมายเหตุ: ${note}`);
  return lines.join('\n');
}

function openWAModal(channel, form) {
  const overlay = document.getElementById('waModalOverlay');
  const msg = buildOrderMessage(form);
  const msgEl = document.getElementById('waModalMsg');
  if (msgEl) msgEl.textContent = msg;

  const header = document.getElementById('waModalHeader');
  const openBtn = document.getElementById('waOpenBtn');
  const channelName = document.getElementById('waChannelName');

  if (channel === 'wa') {
    if (header) { header.className = 'wa-modal-header'; header.querySelector('.wa-modal-header-icon').textContent = '💬'; }
    if (channelName) channelName.textContent = 'WhatsApp';
    if (openBtn) {
      openBtn.className = 'btn btn-wa wa-open-btn';
      openBtn.textContent = '📱 เปิด WhatsApp';
      openBtn.onclick = () => {
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
      };
    }
  } else {
    if (header) { header.className = 'wa-modal-header msg'; header.querySelector('.wa-modal-header-icon').textContent = '💬'; }
    if (channelName) channelName.textContent = 'Messenger';
    if (openBtn) {
      openBtn.className = 'btn btn-msg wa-open-btn msg';
      openBtn.textContent = '💬 เปิด Messenger';
      openBtn.onclick = () => window.open(MSG_LINK, '_blank');
    }
  }

  const copyBtn = document.getElementById('waCopyBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(msg).then(() => showToast('คัดลอกข้อความแล้ว', 'success'));
    };
  }

  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeWAModal() {
  document.getElementById('waModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function initWAModal() {
  document.getElementById('waModalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeWAModal();
  });
  document.getElementById('waModalClose')?.addEventListener('click', closeWAModal);
}

/* ─── CHECKOUT STEPS ────────────────────────────────────── */
let checkoutData = {};

function gotoStep(step) {
  document.querySelectorAll('.checkout-step-panel').forEach((el, i) => {
    el.style.display = i + 1 === step ? 'block' : 'none';
  });
  document.querySelectorAll('.step-item').forEach((el, i) => {
    const idx = i + 1;
    const circle = el.querySelector('.step-circle');
    const label = el.querySelector('.step-label');
    const line = el.querySelector('.step-line');
    if (circle) {
      circle.classList.toggle('active', idx === step);
      circle.classList.toggle('done', idx < step);
      if (idx < step) circle.textContent = '✓';
      else circle.textContent = idx;
    }
    if (label) label.classList.toggle('active', idx === step);
    if (line) line.classList.toggle('done', idx < step);
  });
}

/* ─── RENDER ORDER SUMMARY ──────────────────────────────── */
function renderOrderSummary(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="order-item-row">
        <div class="order-item-thumb" style="background:${item.bg}">${item.emoji}</div>
        <div class="order-item-info">
          <div class="order-item-name">${item.name}${item.variant ? ` <small>(${item.variant})</small>` : ''}</div>
          <div class="order-item-qty">x${item.qty}</div>
        </div>
        <div class="order-item-price">฿${(item.price * item.qty).toLocaleString()}</div>
      </div>`;
  });
  el.innerHTML = html;
}

/* ─── CLEAR CART ────────────────────────────────────────── */
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

/* ─── GLOBAL INIT ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initCartButtons();
  initWAModal();
  updateCartUI();
});
