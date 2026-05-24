/* ==========================================================
   Ruby Store — i18n (Internationalization)
   Languages: th (Thai) · lo (Lao) · en (English)
   Font: Noto Sans Lao for Lao script
   ========================================================== */

'use strict';

const RUBY_LANGS = {

  /* ── THAI (default) ─────────────────────────────────── */
  th: {
    // Navbar
    nav_home:       'หน้าแรก',
    nav_shop:       'สินค้า',
    nav_stores:     'ร้านค้า',
    nav_about:      'เกี่ยวกับ',
    nav_cart:       'ตะกร้า',

    // Hero
    hero_title1:    'สั่งง่าย จ่ายสะดวก',
    hero_title2:    'ผ่าน WhatsApp & Messenger',
    hero_sub:       'เลือกสินค้าที่ชอบ แล้วส่งออเดอร์ผ่านแชท ง่ายๆ ไม่ต้องสมัครสมาชิก ไม่ต้องจำรหัสผ่าน',
    hero_btn_shop:  'ช้อปเลย',
    hero_btn_how:   'วิธีสั่งซื้อ',

    // Stats
    stat_products:  'รายการ',
    stat_stores:    'ร้านค้า',
    stat_free:      'ฟรี',

    // Cart
    cart_title:     'ตะกร้าสินค้า',
    cart_empty:     'ตะกร้าว่างเปล่า',
    cart_empty_sub: 'เพิ่มสินค้าเพื่อเริ่มต้น',
    cart_subtotal:  'ราคาสินค้า',
    cart_shipping:  'ค่าส่ง',
    cart_total:     'รวมทั้งหมด',
    cart_ship_calc: 'คำนวณขั้นตอนถัดไป',
    cart_checkout:  'ดำเนินการสั่งซื้อ →',

    // Shop / Products
    shop_title:     'สินค้าทั้งหมด',
    shop_showing:   'แสดง',
    shop_items:     'รายการ',
    shop_search:    'ค้นหาสินค้า...',
    shop_sort_new:  'ใหม่สุด',
    shop_sort_low:  'ราคา: ต่ำ→สูง',
    shop_sort_high: 'ราคา: สูง→ต่ำ',
    shop_sort_pop:  'ยอดนิยม',
    shop_all_cat:   'ทุกหมวด',
    shop_all_store: 'ทุกร้าน',
    shop_no_result: 'ไม่พบสินค้าที่ค้นหา',
    btn_add_cart:   'ใส่ตะกร้า',
    btn_buy_wa:     'สั่งผ่าน WA',

    // Product page
    prod_reviews:   'รีวิว',
    prod_no_review: 'ยังไม่มีรีวิว',
    prod_tab_desc:  'รายละเอียด',
    prod_tab_spec:  'สเปก',
    prod_tab_rev:   'รีวิว',
    prod_qty:       'จำนวน',
    prod_in_stock:  'มีสินค้า',
    prod_trust1:    'ส่งทั่วไทย',
    prod_trust2:    'คืนได้ 7 วัน',
    prod_trust3:    'สินค้าแท้',
    prod_trust4:    'ตอบเร็ว',

    // Checkout
    co_step1:       'ข้อมูลส่ง',
    co_step2:       'ช่องทาง',
    co_step3:       'ยืนยัน',
    co_shipping:    'ข้อมูลการจัดส่ง',
    co_name:        'ชื่อ-นามสกุล',
    co_phone:       'เบอร์โทร',
    co_address:     'ที่อยู่จัดส่ง',
    co_note:        'หมายเหตุ (ถ้ามี)',
    co_note_ph:     'ข้อความถึงร้านค้า',
    co_delivery:    'วิธีจัดส่ง',
    co_channel:     'เลือกช่องทางสั่งซื้อ',
    co_confirm:     'ยืนยันคำสั่งซื้อ',
    co_terms:       'ฉันยอมรับเงื่อนไขการสั่งซื้อ และเข้าใจว่าการสั่งซื้อผ่านโซเชียลมีเดียไม่มีการตัดเงินออนไลน์',
    co_btn_next:    'ถัดไป',
    co_btn_back:    '← ย้อนกลับ',
    co_btn_wa:      '💬 ส่งคำสั่งซื้อทาง WhatsApp',
    co_btn_msg:     '💬 ส่งคำสั่งซื้อทาง Messenger',
    co_not_robot:   'ฉันไม่ใช่บอท',
    co_verifying:   'กำลังตรวจสอบ...',
    co_verified:    'ยืนยันแล้ว — คุณไม่ใช่บอท',
    co_verify_fail: 'ไม่ผ่านการตรวจสอบ ลองใหม่อีกครั้ง',
    co_verify_req:  'กรุณากดยืนยัน "ฉันไม่ใช่บอท" ก่อน',

    // Profile
    prof_title:     'คำสั่งซื้อของฉัน',
    prof_orders:    'ออเดอร์ทั้งหมด',
    prof_contact:   'ติดต่อร้านค้า',
    prof_no_order:  'ยังไม่มีคำสั่งซื้อ',
    prof_no_order_sub: 'เพิ่มสินค้าลงตะกร้าและสั่งซื้อเพื่อดูประวัติที่นี่',
    status_pending:   'รอยืนยัน',
    status_confirmed: 'ยืนยันแล้ว',
    status_completed: 'สำเร็จ',
    status_cancelled: 'ยกเลิก',

    // Common
    btn_close:      'ปิด',
    loading:        'กำลังโหลด...',
    error_required: 'กรุณากรอกข้อมูล',
    currency:       '฿',
    // Index extras
    hero_tag:        'Social Commerce สำหรับร้านค้า',
    hero_btn_stores: 'ดูร้านค้า',
    stat_items_lbl:  'สินค้า',
    stat_in_sys:     'ในระบบ',
    stat_rating_lbl: 'คะแนนเฉลี่ย',
    sec_bestseller:  'สินค้าขายดี',
    sec_view_all:    'ดูทั้งหมด →',
    sec_stores:      'เลือกร้านค้า',
    sec_how:         'วิธีการสั่งซื้อ',
    how_step1:       'เลือกสินค้า',
    how_step2:       'กรอกที่อยู่',
    how_step3:       'ส่งผ่านแชท',
    how_step4:       'รอรับสินค้า',
    filter_all:      'ทั้งหมด',
    filter_pet:      'สัตว์เลี้ยง',
    filter_computer: 'คอมพิวเตอร์',
    filter_toy:      'ของเล่น',
    nav_account:     'บัญชี',
    // Shop extras
    shop_price_range: 'ช่วงราคา',
    shop_cat_section: 'หมวดหมู่',
    shop_filter_apply:'กรอง',
    sort_default:    'เรียง: ค่าเริ่มต้น',
    // Product extras
    prod_tab_desc_full:'รายละเอียดสินค้า',
    prod_tab_specs:  'ข้อมูลเพิ่มเติม',
    prod_related:    'สินค้าที่เกี่ยวข้อง',
    // Checkout extras
    co_back_shop:    '← กลับซื้อต่อ',
    co_secure:       'ปลอดภัย',
    // Profile extras
    prof_account:    'บัญชีของฉัน',
    prof_history:    'ประวัติการสั่งซื้อ',
    prof_start_shop: 'เริ่มเลือกสินค้าได้เลย!',
  },

  /* ── LAO ────────────────────────────────────────────── */
  lo: {
    // Navbar
    nav_home:       'ໜ້າຫຼັກ',
    nav_shop:       'ສິນຄ້າ',
    nav_stores:     'ຮ້ານຄ້າ',
    nav_about:      'ກ່ຽວກັບ',
    nav_cart:       'ກະຕ່າ',

    // Hero
    hero_title1:    'ສັ່ງງ່າຍ ຈ່າຍສະດວກ',
    hero_title2:    'ຜ່ານ WhatsApp & Messenger',
    hero_sub:       'ເລືອກສິນຄ້າທີ່ຊອບ ແລ້ວສົ່ງອໍເດີຜ່ານແຊດ ງ່າຍໆ ບໍ່ຕ້ອງສະໝັກສະມາຊິກ ບໍ່ຕ້ອງຈຳລະຫັດຜ່ານ',
    hero_btn_shop:  'ຊື້ເລີຍ',
    hero_btn_how:   'ວິທີສັ່ງຊື້',

    // Stats
    stat_products:  'ລາຍການ',
    stat_stores:    'ຮ້ານຄ້າ',
    stat_free:      'ຟຣີ',

    // Cart
    cart_title:     'ກະຕ່າສິນຄ້າ',
    cart_empty:     'ກະຕ່າວ່າງເປົ່າ',
    cart_empty_sub: 'ເພີ່ມສິນຄ້າເພື່ອເລີ່ມຕົ້ນ',
    cart_subtotal:  'ລາຄາສິນຄ້າ',
    cart_shipping:  'ຄ່າສົ່ງ',
    cart_total:     'ລວມທັງໝົດ',
    cart_ship_calc: 'ຄຳນວນຂັ້ນຕໍ່ໄປ',
    cart_checkout:  'ດຳເນີນການສັ່ງຊື້ →',

    // Shop / Products
    shop_title:     'ສິນຄ້າທັງໝົດ',
    shop_showing:   'ສະແດງ',
    shop_items:     'ລາຍການ',
    shop_search:    'ຄົ້ນຫາສິນຄ້າ...',
    shop_sort_new:  'ໃໝ່ສຸດ',
    shop_sort_low:  'ລາຄາ: ຕ່ຳ→ສູງ',
    shop_sort_high: 'ລາຄາ: ສູງ→ຕ່ຳ',
    shop_sort_pop:  'ຍອດນິຍົມ',
    shop_all_cat:   'ທຸກໝວດ',
    shop_all_store: 'ທຸກຮ້ານ',
    shop_no_result: 'ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ',
    btn_add_cart:   'ໃສ່ກະຕ່າ',
    btn_buy_wa:     'ສັ່ງຜ່ານ WA',

    // Product page
    prod_reviews:   'ລີວິວ',
    prod_no_review: 'ຍັງບໍ່ມີລີວິວ',
    prod_tab_desc:  'ລາຍລະອຽດ',
    prod_tab_spec:  'ສະເປັກ',
    prod_tab_rev:   'ລີວິວ',
    prod_qty:       'ຈຳນວນ',
    prod_in_stock:  'ມີສິນຄ້າ',
    prod_trust1:    'ສົ່ງທົ່ວລາວ',
    prod_trust2:    'ຄືນໄດ້ 7 ວັນ',
    prod_trust3:    'ສິນຄ້າແທ້',
    prod_trust4:    'ຕອບໄວ',

    // Checkout
    co_step1:       'ຂໍ້ມູນສົ່ງ',
    co_step2:       'ຊ່ອງທາງ',
    co_step3:       'ຢືນຢັນ',
    co_shipping:    'ຂໍ້ມູນການຈັດສົ່ງ',
    co_name:        'ຊື່ - ນາມສະກຸນ',
    co_phone:       'ເບີໂທ',
    co_address:     'ທີ່ຢູ່ຈັດສົ່ງ',
    co_note:        'ໝາຍເຫດ (ຖ້າມີ)',
    co_note_ph:     'ຂໍ້ຄວາມຫາຮ້ານຄ້າ',
    co_delivery:    'ວິທີຈັດສົ່ງ',
    co_channel:     'ເລືອກຊ່ອງທາງສັ່ງຊື້',
    co_confirm:     'ຢືນຢັນຄຳສັ່ງຊື້',
    co_terms:       'ຂ້ອຍຍອມຮັບເງື່ອນໄຂການສັ່ງຊື້ ແລະ ເຂົ້າໃຈວ່າການສັ່ງຊື້ຜ່ານໂຊຊຽນມີເດຍ ບໍ່ມີການຕັດເງິນອອນລາຍ',
    co_btn_next:    'ຕໍ່ໄປ',
    co_btn_back:    '← ກັບຄືນ',
    co_btn_wa:      '💬 ສົ່ງຄຳສັ່ງຊື້ທາງ WhatsApp',
    co_btn_msg:     '💬 ສົ່ງຄຳສັ່ງຊື້ທາງ Messenger',
    co_not_robot:   'ຂ້ອຍບໍ່ແມ່ນບອດ',
    co_verifying:   'ກຳລັງກວດສອບ...',
    co_verified:    'ຢືນຢັນແລ້ວ — ທ່ານບໍ່ແມ່ນບອດ',
    co_verify_fail: 'ບໍ່ຜ່ານການກວດສອບ ລອງໃໝ່ອີກຄັ້ງ',
    co_verify_req:  'ກະລຸນາກົດຢືນຢັນ "ຂ້ອຍບໍ່ແມ່ນບອດ" ກ່ອນ',

    // Profile
    prof_title:     'ຄຳສັ່ງຊື້ຂອງຂ້ອຍ',
    prof_orders:    'ອໍເດີທັງໝົດ',
    prof_contact:   'ຕິດຕໍ່ຮ້ານຄ້າ',
    prof_no_order:  'ຍັງບໍ່ມີຄຳສັ່ງຊື້',
    prof_no_order_sub: 'ເພີ່ມສິນຄ້າໃສ່ກະຕ່າ ແລ້ວສັ່ງຊື້ເພື່ອເບິ່ງປະຫວັດທີ່ນີ້',
    status_pending:   'ລໍຖ້າຢືນຢັນ',
    status_confirmed: 'ຢືນຢັນແລ້ວ',
    status_completed: 'ສຳເລັດ',
    status_cancelled: 'ຍົກເລີກ',

    // Common
    btn_close:      'ປິດ',
    loading:        'ກຳລັງໂຫຼດ...',
    error_required: 'ກະລຸນາກອກຂໍ້ມູນ',
    currency:       '₭',
    // Index extras
    hero_tag:        'ທຸລະກຳໂຊຊຽນສຳລັບຮ້ານ',
    hero_btn_stores: 'ເບິ່ງຮ້ານຄ້າ',
    stat_items_lbl:  'ສິນຄ້າ',
    stat_in_sys:     'ໃນລະບົບ',
    stat_rating_lbl: 'ຄະແນນສະເລ່ຍ',
    sec_bestseller:  'ສິນຄ້າຂາຍດີ',
    sec_view_all:    'ເບິ່ງທັງໝົດ →',
    sec_stores:      'ເລືອກຮ້ານຄ້າ',
    sec_how:         'ວິທີສັ່ງຊື້',
    how_step1:       'ເລືອກສິນຄ້າ',
    how_step2:       'ຕື່ມທີ່ຢູ່',
    how_step3:       'ສົ່ງຜ່ານແຊດ',
    how_step4:       'ລໍຖ້າສິນຄ້າ',
    filter_all:      'ທັງໝົດ',
    filter_pet:      'ສັດລ້ຽງ',
    filter_computer: 'ຄອມພິວເຕີ',
    filter_toy:      'ຂອງຫຼິ້ນ',
    nav_account:     'ບັນຊີ',
    // Shop extras
    shop_price_range: 'ຊ່ວງລາຄາ',
    shop_cat_section: 'ໝວດໝູ່',
    shop_filter_apply:'ກອງ',
    sort_default:    'ຮຽງ: ຄ່າເລີ່ມຕົ້ນ',
    // Product extras
    prod_tab_desc_full:'ລາຍລະອຽດສິນຄ້າ',
    prod_tab_specs:  'ຂໍ້ມູນເພີ່ມເຕີມ',
    prod_related:    'ສິນຄ້າທີ່ກ່ຽວຂ້ອງ',
    // Checkout extras
    co_back_shop:    '← ກັບໄປຊື້ຕໍ່',
    co_secure:       'ປອດໄພ',
    // Profile extras
    prof_account:    'ບັນຊີຂອງຂ້ອຍ',
    prof_history:    'ປະຫວັດການສັ່ງຊື້',
    prof_start_shop: 'ເລີ່ມເລືອກສິນຄ້າໄດ້ເລີຍ!',
  },

  /* ── ENGLISH ────────────────────────────────────────── */
  en: {
    // Navbar
    nav_home:       'Home',
    nav_shop:       'Products',
    nav_stores:     'Stores',
    nav_about:      'About',
    nav_cart:       'Cart',

    // Hero
    hero_title1:    'Easy Order, Easy Pay',
    hero_title2:    'via WhatsApp & Messenger',
    hero_sub:       'Pick what you love and send your order via chat. No sign-up. No password needed.',
    hero_btn_shop:  'Shop Now',
    hero_btn_how:   'How to Order',

    // Stats
    stat_products:  'items',
    stat_stores:    'stores',
    stat_free:      'free',

    // Cart
    cart_title:     'Shopping Cart',
    cart_empty:     'Your cart is empty',
    cart_empty_sub: 'Add products to get started',
    cart_subtotal:  'Subtotal',
    cart_shipping:  'Shipping',
    cart_total:     'Total',
    cart_ship_calc: 'Calculated at next step',
    cart_checkout:  'Proceed to Checkout →',

    // Shop / Products
    shop_title:     'All Products',
    shop_showing:   'Showing',
    shop_items:     'items',
    shop_search:    'Search products...',
    shop_sort_new:  'Newest',
    shop_sort_low:  'Price: Low→High',
    shop_sort_high: 'Price: High→Low',
    shop_sort_pop:  'Popular',
    shop_all_cat:   'All Categories',
    shop_all_store: 'All Stores',
    shop_no_result: 'No products found',
    btn_add_cart:   'Add to Cart',
    btn_buy_wa:     'Order via WA',

    // Product page
    prod_reviews:   'reviews',
    prod_no_review: 'No reviews yet',
    prod_tab_desc:  'Description',
    prod_tab_spec:  'Specs',
    prod_tab_rev:   'Reviews',
    prod_qty:       'Quantity',
    prod_in_stock:  'In Stock',
    prod_trust1:    'Nationwide Shipping',
    prod_trust2:    '7-Day Return',
    prod_trust3:    'Authentic',
    prod_trust4:    'Fast Reply',

    // Checkout
    co_step1:       'Shipping',
    co_step2:       'Channel',
    co_step3:       'Confirm',
    co_shipping:    'Shipping Information',
    co_name:        'Full Name',
    co_phone:       'Phone Number',
    co_address:     'Shipping Address',
    co_note:        'Note (optional)',
    co_note_ph:     'Message to seller',
    co_delivery:    'Delivery Method',
    co_channel:     'Choose Order Channel',
    co_confirm:     'Confirm Order',
    co_terms:       'I accept the order terms and understand that orders placed via social media do not charge payments online.',
    co_btn_next:    'Next',
    co_btn_back:    '← Back',
    co_btn_wa:      '💬 Send Order via WhatsApp',
    co_btn_msg:     '💬 Send Order via Messenger',
    co_not_robot:   "I'm not a robot",
    co_verifying:   'Verifying...',
    co_verified:    "Verified — You're human!",
    co_verify_fail: 'Verification failed. Please try again.',
    co_verify_req:  'Please verify you are not a robot first.',

    // Profile
    prof_title:     'My Orders',
    prof_orders:    'All Orders',
    prof_contact:   'Contact Store',
    prof_no_order:  'No orders yet',
    prof_no_order_sub: 'Add products to cart and place an order to see history here.',
    status_pending:   'Pending',
    status_confirmed: 'Confirmed',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',

    // Common
    btn_close:      'Close',
    loading:        'Loading...',
    error_required: 'This field is required',
    currency:       '฿',
    // Index extras
    hero_tag:        'Social Commerce',
    hero_btn_stores: 'Browse Stores',
    stat_items_lbl:  'Products',
    stat_in_sys:     'available',
    stat_rating_lbl: 'avg rating',
    sec_bestseller:  'Best Sellers',
    sec_view_all:    'View All →',
    sec_stores:      'Our Stores',
    sec_how:         'How to Order',
    how_step1:       'Pick Items',
    how_step2:       'Fill Address',
    how_step3:       'Send via Chat',
    how_step4:       'Await Delivery',
    filter_all:      'All',
    filter_pet:      'Pets',
    filter_computer: 'Computer',
    filter_toy:      'Toys',
    nav_account:     'Account',
    // Shop extras
    shop_price_range: 'Price Range',
    shop_cat_section: 'Category',
    shop_filter_apply:'Filter',
    sort_default:    'Sort: Default',
    // Product extras
    prod_tab_desc_full:'Product Details',
    prod_tab_specs:  'More Info',
    prod_related:    'Related Products',
    // Checkout extras
    co_back_shop:    '← Keep Shopping',
    co_secure:       'Secure',
    // Profile extras
    prof_account:    'My Account',
    prof_history:    'Order History',
    prof_start_shop: 'Start shopping now!',
  },
};

/* ══ LANGUAGE ENGINE ══════════════════════════════════════ */

const LANG_LABELS = { th: '🇹🇭 ไทย', lo: '🇱🇦 ລາວ', en: '🇬🇧 EN' };
const LAO_FONT_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700;800&display=swap';

let _currentLang = localStorage.getItem('ruby_lang') || 'th';
let _laoFontLoaded = false;

function getLang() { return _currentLang; }

function t(key) {
  return RUBY_LANGS[_currentLang]?.[key] ?? RUBY_LANGS['th']?.[key] ?? key;
}

function _loadLaoFont() {
  if (_laoFontLoaded) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = LAO_FONT_URL;
  document.head.appendChild(link);
  _laoFontLoaded = true;
}

function _applyFont(lang) {
  if (lang === 'lo') {
    _loadLaoFont();
    document.documentElement.style.setProperty('--font-th',
      "'Noto Sans Lao', 'Prompt', 'Inter', sans-serif");
  } else {
    document.documentElement.style.setProperty('--font-th',
      "'Prompt', 'Inter', -apple-system, sans-serif");
  }
}

function _applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const val = t(key);
    if (attr) { el.setAttribute(attr, val); }
    else { el.textContent = val; }
  });
  document.documentElement.lang = _currentLang;
}

function setLang(lang) {
  if (!RUBY_LANGS[lang]) return;
  _currentLang = lang;
  localStorage.setItem('ruby_lang', lang);
  _applyFont(lang);
  _applyTranslations();
  // Update switcher UI
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Dispatch event so pages can re-render dynamic content
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/* ══ LANGUAGE SWITCHER WIDGET ═════════════════════════════ */

function injectLangSwitcher(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'lang-switcher';
  wrapper.innerHTML = Object.entries(LANG_LABELS).map(([code, label]) =>
    `<button class="lang-btn${_currentLang === code ? ' active' : ''}" data-lang="${code}" onclick="setLang('${code}')" title="${label}">${label}</button>`
  ).join('');
  target.appendChild(wrapper);
}

/* ══ AUTO-INIT ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  _applyFont(_currentLang);
  _applyTranslations();
});

window.RubyI18n = { t, setLang, getLang, injectLangSwitcher };
