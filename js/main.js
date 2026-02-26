// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

function toggleMobileNav() {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  mobileNavOverlay.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileNav);
mobileNavOverlay.addEventListener('click', toggleMobileNav);
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileNav.classList.contains('active')) {
      toggleMobileNav();
    }
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
fadeElements.forEach(el => {
  observer.observe(el);
});

// Fallback: reveal all elements after 3 seconds in case observer doesn't fire
setTimeout(() => {
  fadeElements.forEach(el => el.classList.add('visible'));
}, 3000);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ===== QUOTE CALCULATOR =====
const quoteItems = {
  domestic: [
    { id: 'single-oven', name: 'Single Oven', price: 45 },
    { id: 'double-oven', name: 'Double Oven', price: 65 },
    { id: 'range-oven', name: 'Range Oven', price: 85 },
    { id: 'aga-2', name: 'AGA (2 Oven)', price: 120 },
    { id: 'aga-4', name: 'AGA (4 Oven)', price: 180 },
    { id: 'hob', name: 'Hob / Cooktop', price: 25 },
    { id: 'extractor', name: 'Extractor Hood', price: 25 },
    { id: 'microwave', name: 'Microwave', price: 15 },
    { id: 'bbq', name: 'BBQ Grill', price: 40 },
    { id: 'warming-drawer', name: 'Warming Drawer', price: 15 }
  ],
  commercial: [
    { id: 'comm-single', name: 'Commercial Single Oven', price: 75 },
    { id: 'comm-double', name: 'Commercial Double Oven', price: 95 },
    { id: 'comm-range', name: 'Commercial Range', price: 120 },
    { id: 'comm-fryer', name: 'Deep Fat Fryer', price: 50 },
    { id: 'comm-grill', name: 'Commercial Grill', price: 60 },
    { id: 'comm-extractor', name: 'Commercial Extractor', price: 80 }
  ]
};

// Track selections: { id: { name, price, qty } }
let selections = {};

function updateQuoteSummary() {
  const summaryItems = document.getElementById('summary-items');
  const summaryTotal = document.getElementById('summary-total-price');
  const summaryDiscount = document.getElementById('summary-discount');
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryEmpty = document.getElementById('summary-empty');
  const hiddenQuoteDetails = document.getElementById('hidden-quote-details');

  const items = Object.values(selections).filter(s => s.qty > 0);

  if (items.length === 0) {
    summaryItems.innerHTML = '';
    summaryEmpty.style.display = 'block';
    summaryTotal.textContent = '£0';
    summaryDiscountRow.style.display = 'none';
    if (hiddenQuoteDetails) hiddenQuoteDetails.value = '';
    return;
  }

  summaryEmpty.style.display = 'none';

  let subtotal = 0;
  let totalItemCount = 0;
  let html = '';
  let detailsText = '';

  items.forEach(item => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    totalItemCount += item.qty;
    const qtyLabel = item.qty > 1 ? ` x${item.qty}` : '';
    html += `
      <div class="summary-item">
        <span class="item-name">${item.name}${qtyLabel}</span>
        <span class="item-price">£${lineTotal}</span>
      </div>
    `;
    detailsText += `${item.name} x${item.qty} = £${lineTotal}\n`;
  });

  summaryItems.innerHTML = html;

  // Discount logic
  let discount = 0;
  let discountLabel = '';
  if (totalItemCount >= 3) {
    discount = 0.10;
    discountLabel = 'Multi-item discount (10%)';
  } else if (totalItemCount >= 2) {
    discount = 0.05;
    discountLabel = 'Multi-item discount (5%)';
  }

  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  if (discount > 0) {
    summaryDiscountRow.style.display = 'flex';
    summaryDiscount.textContent = `-£${discountAmount}`;
    document.getElementById('summary-discount-label').textContent = discountLabel;
  } else {
    summaryDiscountRow.style.display = 'none';
  }

  summaryTotal.textContent = `£${total}`;

  // Update hidden field for form submission
  if (hiddenQuoteDetails) {
    let fullDetails = detailsText;
    if (discount > 0) {
      fullDetails += `\n${discountLabel}: -£${discountAmount}`;
    }
    fullDetails += `\nTotal: £${total}`;
    hiddenQuoteDetails.value = fullDetails;
  }

  // Update hidden total field
  const hiddenTotal = document.getElementById('hidden-quote-total');
  if (hiddenTotal) {
    hiddenTotal.value = `£${total}`;
  }
}

function changeQty(itemId, delta) {
  const item = [...quoteItems.domestic, ...quoteItems.commercial].find(i => i.id === itemId);
  if (!item) return;

  if (!selections[itemId]) {
    selections[itemId] = { name: item.name, price: item.price, qty: 0 };
  }

  selections[itemId].qty = Math.max(0, selections[itemId].qty + delta);

  // Update display
  const qtyDisplay = document.querySelector(`[data-qty="${itemId}"]`);
  if (qtyDisplay) {
    qtyDisplay.textContent = selections[itemId].qty;
  }

  // Toggle selected state
  const quoteItemEl = document.querySelector(`[data-item="${itemId}"]`);
  if (quoteItemEl) {
    quoteItemEl.classList.toggle('selected', selections[itemId].qty > 0);
  }

  updateQuoteSummary();
}

// ===== CONTACT FORM HANDLING =====
function setupFormSubmission(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== BACK TO TOP =====
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  setupFormSubmission('contact-form');
  setupFormSubmission('quote-form');

  // Trigger scroll handler for initial state
  window.dispatchEvent(new Event('scroll'));
});
