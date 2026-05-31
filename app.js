/* =========================================================
   Ruby Store — app.js
   Vanilla JS: cart, WA modal, helpers, products data
   ========================================================= */

'use strict';

/* ─── XSS ESCAPE HELPER ────────────────────────────────── */
function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─── PRODUCT DATA ─────────────────────────────────────── */
window.PRODUCTS = [];
window._rubyProdsReady = false; // flag: true once Supabase products loaded

/* ─── LOAD PRODUCTS: localStorage cache first, then Supabase ─── */
(function () {
  // 1. Load from localStorage cache immediately (sync, no network)
  try {
    const cache = localStorage.getItem('ruby_products');
    if (cache) {
      const parsed = JSON.parse(cache);
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.PRODUCTS = parsed;
      }
    }
  } catch (e) { /* ignore */ }

  // 2. Fetch from Supabase after DOM ready
  //    Use setTimeout(0) on dispatch so all DOMContentLoaded handlers finish
  //    registering their event listeners BEFORE the event fires.
  async function _fetchFromCloud() {
    if (typeof RubyDB === 'undefined' || !RubyDB.isCloudEnabled()) return;
    // Skip product fetch on checkout/success pages — not needed & wastes iOS RAM
    const _pg = window.location.pathname;
    if (_pg.includes('checkout') || _pg.includes('success')) return;
    try {
      const prods = await RubyDB.fetchProducts();
      if (prods && prods.length > 0) {
        window.PRODUCTS = prods;
        window._rubyProdsReady = true;
        setTimeout(function () {
          window.dispatchEvent(new CustomEvent('ruby:products-loaded', { detail: prods }));
        }, 0);
      }
    } catch (e) { /* offline — use cached */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _fetchFromCloud);
  } else {
    // DOMContentLoaded already fired (script injected late)
    _fetchFromCloud();
  }
})();


/* ─── CART STATE ────────────────────────────────────────── */
// Dual-read: localStorage first, sessionStorage fallback (iOS quota safety)
let cart = (function() {
  try {
    const a = localStorage.getItem('ruby_cart');
    if (a) return JSON.parse(a);
  } catch(e) {}
  try {
    const b = sessionStorage.getItem('ruby_cart');
    if (b) return JSON.parse(b);
  } catch(e) {}
  return [];
})();

function saveCart() {
  const data = JSON.stringify(cart);
  // Always dual-write: localStorage + sessionStorage
  // If localStorage quota exceeded on iOS, sessionStorage still works
  try { localStorage.setItem('ruby_cart', data); } catch(e) {}
  try { sessionStorage.setItem('ruby_cart', data); } catch(e) {}
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(productId, qty = 1, variant = null, variantPrice = null, onSuccess = null) {
  const pid = typeof productId === 'string' ? (isNaN(productId) ? productId : Number(productId)) : productId;
  // 1. Try window.PRODUCTS first
  let product = (window.PRODUCTS || []).find(p => p.id === pid);

  // 2. Fallback: localStorage cache (when PRODUCTS not yet loaded on mobile)
  if (!product) {
    try {
      const cached = JSON.parse(localStorage.getItem('ruby_products') || '[]');
      product = cached.find(p => p.id === pid);
      if (product && window.PRODUCTS && window.PRODUCTS.length === 0) {
        window.PRODUCTS = cached; // restore from cache
      }
    } catch(e) {}
  }

  if (!product) {
    let waited = 0;
    const interval = setInterval(() => {
      waited += 100;
      let p = (window.PRODUCTS || []).find(p => p.id === productId);
      if (!p) {
        try {
          const cached = JSON.parse(localStorage.getItem('ruby_products') || '[]');
          p = cached.find(p => p.id === productId);
        } catch(e) {}
      }
      if (p || waited >= 3000) {
        clearInterval(interval);
        if (p) addToCart(productId, qty, variant, variantPrice, onSuccess);
        else showToast('ກະລຸນາລໍຖ້າສິນຄ້າໂຫຼດ ແລ້ວລອງໃໝ່', 'error');
      }
    }, 100);
    return;
  }

  // Use variant price if provided and valid, else base price
  const price = (variantPrice && variantPrice > 0) ? variantPrice : product.price;

  const key = variant ? `${productId}|${variant}` : productId;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
    existing.price = price; // keep price in sync with variant selection
  } else {
    cart.push({
      key,
      id: productId,
      name: product.name,
      price,
      imgUrl: product.imgUrl || null,
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
  if (typeof window._refreshCartBar === 'function') window._refreshCartBar();
  showToast(`ເພີ່ມ "${product.name}" ໃສ່ກະຕ່າແລ້ວ`, 'success');
  if (typeof onSuccess === 'function') onSuccess();
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
  const total = getCartTotal();

  // Navbar badge (desktop + mobile)
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }
  // Mobile bottom nav badge
  const dot = document.getElementById('mobileCartDot');
  if (dot) {
    dot.textContent = count;
    dot.classList.toggle('hidden', count === 0);
  }
  // Floating cart bar (mobile — most visible)
  const bar = document.getElementById('floatingCartBar');
  if (bar) {
    if (count > 0) {
      bar.style.display = 'flex';
      const countEl = document.getElementById('floatingCartCount');
      if (countEl) countEl.textContent = count + ' ລາຍການ · ₭' + total.toLocaleString();
    } else {
      bar.style.display = 'none';
    }
  }
  // Cart sidebar totals
  const sub = total;
  const subEl = document.getElementById('cartSubtotalVal');
  const totEl = document.getElementById('cartTotalVal');
  if (subEl) subEl.textContent = '₭' + sub.toLocaleString();
  if (totEl) totEl.textContent = '₭' + sub.toLocaleString();
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
    const _imgContent = item.imgUrl
      ? `<img src="${item.imgUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:52%;height:52%;opacity:.35;"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
    div.innerHTML = `
      <div class="cart-item-img" style="background:${item.bg || '#F5F5F5'};display:flex;align-items:center;justify-content:center;">${_imgContent}</div>
      <div class="cart-item-body">
        <div class="cart-item-name">${_esc(item.name)}</div>
        ${(item.variant && item.variant !== 'undefined') ? `<div class="cart-item-variant">${_esc(item.variant)}</div>` : ''}
        <div class="cart-item-price">₭${item.price.toLocaleString()}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty('${item.key}', -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.key}', 1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart('${item.key}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
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
  updateCartUI();
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
/* ─── WISHLIST ───────────────────────────────────────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('ruby_wishlist') || '[]'); } catch { return []; }
}
function isWishlisted(id) { return getWishlist().includes(String(id)); }
function toggleWishlist(id, btnEl) {
  const sid = String(id);
  let wl = getWishlist();
  if (wl.includes(sid)) {
    wl = wl.filter(x => x !== sid);
    if (btnEl) btnEl.innerHTML = _heartIcon(false);
    showToast('ລຶບອອກຈາກ Wishlist');
  } else {
    wl.push(sid);
    if (btnEl) btnEl.innerHTML = _heartIcon(true);
    showToast('ເພີ່ມໃນ Wishlist ✓', 'success');
  }
  localStorage.setItem('ruby_wishlist', JSON.stringify(wl));
}
function _heartIcon(filled) {
  return filled
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#E53935" stroke="#E53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
}

function buildProductCard(p) {
  const badgeHtml = p.badge
    ? `<span class="product-badge ${p.badge}">${p.badge === 'new' ? '✨ ໃໝ່' : '🏷️ Sale'}</span>`
    : '';
  const oldPriceHtml = p.oldPrice
    ? `<span style="text-decoration:line-through;color:var(--muted);font-size:0.8rem;font-weight:400;">₭${p.oldPrice.toLocaleString()}</span>`
    : '';
  const wished = isWishlisted(p.id);
  return `
    <div class="product-card" data-id="${p.id}">
      <a href="product.html#${p.id}" class="product-img" style="background:${p.bg};text-decoration:none;">
        ${badgeHtml}
        ${p.imgUrl
          ? `<img src="${p.imgUrl}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
          : `<span style="font-size:3rem;">${p.emoji}</span>`}
        <button class="wishlist-btn${wished?' active':''}" onclick="event.preventDefault();event.stopPropagation();toggleWishlist(${JSON.stringify(p.id)},this);" aria-label="Wishlist">${_heartIcon(wished)}</button>
      </a>
      <div class="product-body">
        <div class="product-store">${_esc(p.storeName || localStorage.getItem('ruby_store_name_' + p.store) || {pet:'Ruby Pet Shop',computer:'Ruby Computer',toy:'Ruby Toy Shop'}[p.store] || '')}</div>
        <a href="product.html#${_esc(p.id)}" class="product-name" style="text-decoration:none;color:inherit;">${_esc(p.name)}</a>
        <div class="product-price">
          ₭${p.price.toLocaleString()} ${oldPriceHtml}
        </div>
        <button class="product-add-btn" onclick="addToCart(${JSON.stringify(p.id)});this.blur();">+ ໃສ່ກະຕ່າ</button>
      </div>
    </div>`;
}

function bindAddToCart() {
  // Already handled via onclick in buildProductCard
}

/* ─── WA MODAL ──────────────────────────────────────────── */
function getWaNumber() { return localStorage.getItem('ruby_wa_number') || '8562078926245'; }
function getMsgLink()  { return localStorage.getItem('ruby_msg_link')  || 'https://m.me/rubystore'; }

function buildOrderMessage(form) {
  const name     = form?.name     || 'ລູກຄ້າ';
  const phone    = form?.phone    || '-';
  const address  = form?.address  || '-';
  const delivery = form?.delivery || 'ຈັດສົ່ງພັດສະດຸ';
  const note     = form?.note     || '-';

  let lines = ['🛍️ *ສັ່ງຊື້ຈາກ Ruby Store*\n'];
  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name}${item.variant ? ` (${item.variant})` : ''} x${item.qty} = ₭${(item.price * item.qty).toLocaleString()}`);
  });
  lines.push('');
  lines.push(`💰 ລວມ: ₭${getCartTotal().toLocaleString()}`);
  lines.push(`🚚 ຈັດສົ່ງ: ${delivery}`);
  lines.push('');
  lines.push(`👤 ຊື່: ${name}`);
  lines.push(`📞 ໂທ: ${phone}`);
  lines.push(`📍 ທີ່ຢູ່: ${address}`);
  if (note && note !== '-') lines.push(`📝 ໝາຍເຫດ: ${note}`);
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

  const _msgSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`;
  const _btnSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`;
  if (channel === 'wa') {
    if (header) { header.className = 'wa-modal-header'; header.querySelector('.wa-modal-header-icon').innerHTML = _msgSvg; }
    if (channelName) channelName.textContent = 'WhatsApp';
    if (openBtn) {
      openBtn.className = 'btn btn-wa wa-open-btn';
      openBtn.innerHTML = _btnSvg + 'ເປີດ WhatsApp';
      openBtn.onclick = () => {
        const url = `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
      };
    }
  } else {
    if (header) { header.className = 'wa-modal-header msg'; header.querySelector('.wa-modal-header-icon').innerHTML = _msgSvg; }
    if (channelName) channelName.textContent = 'Messenger';
    if (openBtn) {
      openBtn.className = 'btn btn-msg wa-open-btn msg';
      openBtn.innerHTML = _btnSvg + 'ເປີດ Messenger';
      openBtn.onclick = () => window.open(getMsgLink(), '_blank');
    }
  }

  const copyBtn = document.getElementById('waCopyBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(msg).then(() => showToast('ສຳເນົາຂໍ້ຄວາມແລ້ວ', 'success'));
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
          <div class="order-item-name">${_esc(item.name)}${item.variant ? ` <small>(${_esc(item.variant)})</small>` : ''}</div>
          <div class="order-item-qty">x${item.qty}</div>
        </div>
        <div class="order-item-price">₭${(item.price * item.qty).toLocaleString()}</div>
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
