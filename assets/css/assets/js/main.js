// ---------- Product data ----------
const PRODUCTS = [
  {id:'o1', title:'Tide & Amber', price:1299, img:'https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=900&q=80', desc:'Sea salt, bergamot, amber.'},
  {id:'o2', title:'Midnight Kelp', price:1399, img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', desc:'Kelp accord, jasmine, musk.'},
  {id:'o3', title:'Coral Bloom', price:1199, img:'https://images.unsplash.com/photo-1541516160074-17f7f46b42f4?auto=format&fit=crop&w=900&q=80', desc:'Neroli, peony, driftwood.'},
  {id:'o4', title:'Salted Vetiver', price:1499, img:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80', desc:'Vetiver, cedar, sea breeze.'},
  {id:'o5', title:'Luminous Wave', price:1099, img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', desc:'Citrus, lavender, amber.'}
];

// ---------- Utilities ----------
const $ = id => document.getElementById(id);
const q = sel => document.querySelector(sel);

// ---------- Render featured & shop ----------
function renderFeatured(){
  const featuredGrid = q('#featuredGrid') || q('#productsGrid');
  if(!featuredGrid) return;
  featuredGrid.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="meta"><h4>${p.title}</h4><div class="price">₹${p.price}</div></div>
      <div class="desc">${p.desc}</div>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="small" onclick="openModal('${p.id}')">View</button>
        <button class="small" onclick="addToCart('${p.id}',1)">Add 1</button>
      </div>
    `;
    featuredGrid.appendChild(card);
  });
}

// ---------- Modal ----------
const modal = (() => {
  const panel = document.createElement('div');
  panel.id = 'tempModal';
  return { panel };
})();

function openModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const modalEl = document.querySelector('#productModal');
  if(!modalEl) {
    // build quick modal if not present
    console.warn('Modal container missing from page.');
    return;
  }
  modalEl.querySelector('#modalImg').src = p.img;
  modalEl.querySelector('#modalTitle').innerText = p.title;
  modalEl.querySelector('#modalPrice').innerText = `₹${p.price}`;
  modalEl.querySelector('#modalDesc').innerText = p.desc;
  modalEl.querySelector('#modalQty').value = 1;
  modalEl.classList.remove('hidden');

  // wire modal buttons
  modalEl.querySelector('#modalAdd').onclick = function(){
    const qty = parseInt(modalEl.querySelector('#modalQty').value) || 1;
    addToCart(p.id, qty);
    closeModal();
    openCart();
  };
  modalEl.querySelector('#modalBuy').onclick = function(){
    const qty = parseInt(modalEl.querySelector('#modalQty').value)||1;
    addToCart(p.id, qty);
    closeModal();
    checkout();
  };
}

function closeModal(){
  const modalEl = document.querySelector('#productModal');
  if(modalEl) modalEl.classList.add('hidden');
}

// ---------- CART ----------
let CART = [];

function findProd(id){ return PRODUCTS.find(p=>p.id===id); }
function addToCart(id, qty){
  const p = findProd(id);
  if(!p) return;
  const existing = CART.find(i=>i.id===id);
  if(existing) existing.qty += qty;
  else CART.push({ id:p.id, title:p.title, price:p.price, img:p.img, qty:qty });
  updateCartUI();
}

function updateCartUI(){
  const itemsEl = q('body').querySelectorAll ? $('cartItems') : null;
  const panel = $('cartPanel');
  if(!$) return;
  // ensure elements exist on the current page
  const cartItemsContainer = document.querySelectorAll('#cartItems')[0];
  const cartCountEls = document.querySelectorAll('#cartCount');
  const subtotalEl = document.querySelectorAll('#subtotal')[0];

  // update count
  const totalQty = CART.reduce((s,i)=>s+i.qty,0);
  cartCountEls.forEach(e=>e.innerText = totalQty);

  // update items list
  if(cartItemsContainer){
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    CART.forEach((it, idx)=>{
      subtotal += it.qty * it.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${it.img}" alt="${it.title}">
        <div style="flex:1"><strong>${it.title}</strong><div style="color:var(--muted);margin-top:6px">Qty: ${it.qty}</div></div>
        <div style="text-align:right">
          <div style="font-weight:800;color:var(--gold)">₹${it.price*it.qty}</div>
          <div style="margin-top:8px">
            <button class="small" onclick="changeQty(${idx},-1)">-</button>
            <button class="small" onclick="changeQty(${idx},1)">+</button>
            <button class="small" onclick="removeItem(${idx})">Remove</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });
    if(subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
  }
}

function changeQty(index, delta){
  if(!CART[index]) return;
  CART[index].qty += delta;
  if(CART[index].qty <= 0) CART.splice(index,1);
  updateCartUI();
}
function removeItem(index){ CART.splice(index,1); updateCartUI(); }

function openCart(){ 
  const cp = document.getElementById('cartPanel');
  if(cp) cp.classList.remove('hidden'); 
  updateCartUI();
}
function closeCart(){ const cp = document.getElementById('cartPanel'); if(cp) cp.classList.add('hidden'); }

function checkout(){
  if(CART.length === 0){ alert('Cart is empty'); return; }
  // simulated checkout
  const total = CART.reduce((s,i)=>s+i.qty*i.price,0);
  alert(`Simulated payment — total ₹${total}\nThank you for your purchase!`);
  CART = []; updateCartUI(); closeCart();
}

// ---------- Init & event wiring ----------
document.addEventListener('DOMContentLoaded', function(){
  renderFeatured();
  // wire cart buttons present on pages
  document.querySelectorAll('#cartBtn').forEach(b=>b.addEventListener('click', openCart));
  document.querySelectorAll('#closeCart').forEach(b=>b.addEventListener('click', closeCart));
  document.querySelectorAll('#closeModal').forEach(b=>b.addEventListener('click', closeModal));
  document.querySelectorAll('#productModal').forEach(el=>{
    // keep hidden unless opened
    el.classList.add('hidden');
  });
  // if contact form exists, keep it functional (simulated)
  const cf = document.getElementById('contactForm');
  if(cf) cf.addEventListener('submit', e=>{ e.preventDefault(); alert('Message sent (simulated)'); cf.reset(); });
});
