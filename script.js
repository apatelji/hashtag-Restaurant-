/* ============================================
   ALIMENTO — script.js
   ============================================ */

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ---- Menu data ---- */
const menuData = {
  bites: [
    { icon: '🌶️', name: 'Honey Chilli Potato', desc: 'Crispy potato tossed in sweet chilli honey glaze', price: '₹199' },
    { icon: '🥢', name: 'Manchurian', desc: 'Veg or chicken dumplings in tangy Manchurian sauce', price: '₹229' },
    { icon: '🧆', name: 'Crispy Corn', desc: 'Golden sweet corn bites with masala seasoning', price: '₹179' },
  ],
  pizza: [
    { icon: '🍕', name: 'Thin Crust Pizza', desc: 'Wood-fired thin crust with fresh mozzarella & basil', price: '₹349' },
    { icon: '🌿', name: 'Primavera Pizza', desc: 'Garden-fresh veggies on a classic tomato base', price: '₹329' },
    { icon: '🧀', name: 'Pasta Carbonara', desc: 'Creamy Roman-style pasta with parmesan', price: '₹299' },
  ],
  asian: [
    { icon: '🍜', name: 'Hakka Noodles', desc: 'Indo-Chinese stir-fried noodles with crunchy veggies', price: '₹219' },
    { icon: '🍲', name: 'Manchow Soup', desc: 'Hot & crispy-topped Chinese broth, soul-warming', price: '₹189' },
    { icon: '🥡', name: 'Fried Rice Platter', desc: 'Wok-tossed fragrant fried rice with choice of protein', price: '₹249' },
  ],
  main: [
    { icon: '🥩', name: 'Grilled Chicken Steak', desc: 'Juicy marinated chicken breast with herb butter sauce', price: '₹449' },
    { icon: '🍝', name: 'Lasagna', desc: 'Layered pasta bake with rich bolognese & béchamel', price: '₹379' },
    { icon: '🍛', name: 'Butter Chicken', desc: 'Slow-cooked in creamy tomato masala — a classic', price: '₹349' },
  ],
  drinks: [
    { icon: '☕', name: 'Cappuccino', desc: 'Velvety espresso with silky microfoam, barista crafted', price: '₹149' },
    { icon: '🍹', name: 'Mojito', desc: 'Fresh mint, lime & sparkling water — utterly refreshing', price: '₹179' },
    { icon: '🧋', name: 'Cold Coffee Shake', desc: 'Rich blended cold coffee with a scoop of vanilla', price: '₹169' },
  ],
  combos: [
    { icon: '🎁', name: 'Date Night Combo', desc: 'Pizza + Pasta + 2 Drinks — perfect for two', price: '₹799' },
    { icon: '👨‍👩‍👧', name: 'Family Platter', desc: 'Noodles, Rice, Starters + 4 Beverages for the whole family', price: '₹1,299' },
    { icon: '💼', name: 'Corporate Lunch Box', desc: 'Main course + starter + cold drink + dessert', price: '₹549' },
  ],
};

const menuGrid = document.getElementById('menuGrid');
const tabs = document.querySelectorAll('.tab');

function renderMenu(cat) {
  const items = menuData[cat] || [];
  menuGrid.innerHTML = items.map((item, i) => `
    <div class="menu-card" style="animation-delay:${i * 0.08}s">
      <div class="menu-card-icon">${item.icon}</div>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="menu-price">${item.price}</div>
    </div>
  `).join('');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderMenu(tab.dataset.cat);
  });
});

renderMenu('bites');

/* ---- Reviews carousel ---- */
const cards = document.querySelectorAll('.review-card');
const dotsContainer = document.getElementById('carouselDots');
let current = 0;

cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(idx) {
  cards[current].classList.remove('active');
  dotsContainer.children[current].classList.remove('active');
  current = idx;
  cards[current].classList.add('active');
  dotsContainer.children[current].classList.add('active');
}

setInterval(() => goTo((current + 1) % cards.length), 5000);

/* ---- Scroll reveal (IntersectionObserver) ---- */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal { opacity:0; transform:translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }
`;
document.head.appendChild(revealStyle);

document.querySelectorAll('.menu-card,.why-card,.hl-item,.c-item,.g-item,.service-badge').forEach(el => {
  el.classList.add('reveal');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---- Reservation form — Email + WhatsApp notification ---- */
const reserveForm = document.getElementById('reserveForm');
const toast      = document.getElementById('toast');

reserveForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name     = document.getElementById('fname').value.trim();
  const phone    = document.getElementById('fphone').value.trim();
  const datetime = document.getElementById('fdate').value;
  const guests   = document.getElementById('fguests').value;
  const seating  = document.getElementById('fseating').value;

  const submitBtn = document.getElementById('submitReserve');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    /* -- Email via Formsubmit.co (free, no signup required) -- */
    const res = await fetch('https://formsubmit.co/ajax/honor911n@gmail.com', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body   : JSON.stringify({
        name,
        phone,
        'Date & Time' : datetime,
        'No. of Guests': guests,
        'Seating'     : seating,
        _subject      : `🍽️ New Table Reservation — ${name}`,
        _captcha      : 'false',
        _template     : 'table',
      }),
    });

    const data = await res.json();

    if (String(data.success) === 'true') {
      /* -- Success toast -- */
      toast.textContent = '✅ Table Reserved! Check WhatsApp for confirmation.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
      reserveForm.reset();

      /* -- WhatsApp alert to restaurant (+91 9161485886) -- */
      const waMsg =
        `🍽️ *New Reservation — Alimento*\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `📅 Date/Time: ${datetime}\n` +
        `👥 Guests: ${guests}\n` +
        `🪑 Seating: ${seating}`;
      setTimeout(() => {
        window.open(`https://wa.me/919161485886?text=${encodeURIComponent(waMsg)}`, '_blank');
      }, 600);

    } else {
      throw new Error('Submission failed');
    }

  } catch {
    toast.textContent = '⚠️ Could not send. Please call +91 9161485886.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  } finally {
    submitBtn.textContent = 'Book Your Table Now';
    submitBtn.disabled = false;
  }
});
