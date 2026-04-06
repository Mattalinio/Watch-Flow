const products = [
  {
    id: 1,
    brand: "Rolex",
    brandSlug: "rolex",
    model: "Submariner Date",
    ref: "126610LN",
    price: 11500,
    condition: "Unworn",
    year: 2023,
    desc: "The iconic Submariner in stainless steel. Unworn with full set including box and papers.",
    movement: "Automatic",
    caseMaterial: "Stainless Steel",
    boxPapers: "Yes",
    image: "images/products/seiko%20random%201.webp",
  },
  {
    id: 2,
    brand: "Rolex",
    brandSlug: "rolex",
    model: "Datejust 41",
    ref: "126300",
    price: 8200,
    condition: "Very Good",
    year: 2021,
    desc: "Classic Datejust 41 in steel with Jubilee bracelet. Excellent condition, minor signs of wear.",
    movement: "Automatic",
    caseMaterial: "Stainless Steel",
    boxPapers: "Yes",
    image: "images/products/seiko%20random%202.png",
  },
  {
    id: 3,
    brand: "Audemars Piguet",
    brandSlug: "audemars-piguet",
    model: "Royal Oak",
    ref: "15510ST",
    price: 24900,
    condition: "Unworn",
    year: 2022,
    desc: "The legendary Royal Oak in stainless steel. Full set, unworn, complete with AP documentation.",
    movement: "Automatic",
    caseMaterial: "Stainless Steel",
    boxPapers: "Yes",
    image: "images/products/seiko%20random%203.jpeg",
  },
  {
    id: 4,
    brand: "Omega",
    brandSlug: "omega",
    model: "Speedmaster Moonwatch",
    ref: "310.30.42.50.01.001",
    price: 5800,
    condition: "Very Good",
    year: 2020,
    desc: "Iconic Moonwatch with manual winding movement. Serviced, excellent condition.",
    movement: "Manual",
    caseMaterial: "Stainless Steel",
    boxPapers: "Yes",
    image: "",
  },
  {
    id: 5,
    brand: "Rolex",
    brandSlug: "rolex",
    model: 'GMT-Master II "Pepsi"',
    ref: "126710BLRO",
    price: 17400,
    condition: "Like New",
    year: 2022,
    desc: "The Pepsi GMT in steel on jubilee. Barely worn, full set with stickers.",
    movement: "Automatic",
    caseMaterial: "Stainless Steel",
    boxPapers: "Yes",
    image: "",
  },
  {
    id: 6,
    brand: "Omega",
    brandSlug: "omega",
    model: "Seamaster 300M",
    ref: "210.30.42.20.03.001",
    price: 4100,
    condition: "Very Good",
    year: 2021,
    desc: "Bond watch in steel. Excellent condition, full set.",
    movement: "Automatic",
    caseMaterial: "Stainless Steel",
    boxPapers: "Yes",
    image: "",
  },
];

const page = document.body.dataset.page;
const navbar = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const faviconLink = document.querySelector("#dynamic-favicon");
let pageSpinnerOverlay = null;

const formatPrice = (value) => `€ ${value.toLocaleString("nl-NL")}`;
let heroClockStarted = false;
let priceObserver = null;

const spinnerMarkup = () => `
  <div class="wf-spinner" aria-hidden="true">
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(168,196,212,0.15)" stroke-width="0.8"></circle>
      <g stroke="rgba(168,196,212,0.3)" stroke-width="0.8" stroke-linecap="round">
        <line x1="20" y1="5" x2="20" y2="7.8"></line>
        <line x1="27.5" y1="7.01" x2="26.1" y2="9.43"></line>
        <line x1="32.99" y1="12.5" x2="30.57" y2="13.9"></line>
        <line x1="35" y1="20" x2="32.2" y2="20"></line>
        <line x1="32.99" y1="27.5" x2="30.57" y2="26.1"></line>
        <line x1="27.5" y1="32.99" x2="26.1" y2="30.57"></line>
        <line x1="20" y1="35" x2="20" y2="32.2"></line>
        <line x1="12.5" y1="32.99" x2="13.9" y2="30.57"></line>
        <line x1="7.01" y1="27.5" x2="9.43" y2="26.1"></line>
        <line x1="5" y1="20" x2="7.8" y2="20"></line>
        <line x1="7.01" y1="12.5" x2="9.43" y2="13.9"></line>
        <line x1="12.5" y1="7.01" x2="13.9" y2="9.43"></line>
      </g>
      <line class="wf-spinner-hand" x1="20" y1="20" x2="20" y2="5" stroke="#a8c4d4" stroke-width="1" stroke-linecap="round"></line>
      <circle cx="20" cy="20" r="1.5" fill="#a8c4d4"></circle>
    </svg>
  </div>
`;

const ensurePageSpinnerOverlay = () => {
  if (pageSpinnerOverlay) {
    return pageSpinnerOverlay;
  }

  pageSpinnerOverlay = document.createElement("div");
  pageSpinnerOverlay.className = "wf-spinner-overlay";
  pageSpinnerOverlay.innerHTML = spinnerMarkup();
  document.body.appendChild(pageSpinnerOverlay);
  return pageSpinnerOverlay;
};

const showPageTransition = (callback) => {
  const overlay = ensurePageSpinnerOverlay();
  overlay.classList.add("visible");
  window.setTimeout(callback, 300);
};

const navigateWithSpinner = (href) => {
  showPageTransition(() => {
    window.location.href = href;
  });
};

const createSvgLine = (x1, y1, x2, y2, strokeWidth) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toFixed(2));
  line.setAttribute("y1", y1.toFixed(2));
  line.setAttribute("x2", x2.toFixed(2));
  line.setAttribute("y2", y2.toFixed(2));
  line.setAttribute("stroke", "#a8c4d4");
  line.setAttribute("stroke-width", String(strokeWidth));
  line.setAttribute("stroke-linecap", "round");
  return line;
};

const initHeroClock = () => {
  if (heroClockStarted) {
    return;
  }

  const clock = document.getElementById("hero-clock");
  const hourTicks = document.getElementById("clock-hour-ticks");
  const minuteTicks = document.getElementById("clock-minute-ticks");

  if (!clock || !hourTicks || !minuteTicks) {
    return;
  }

  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const outerR = 82;
    const innerR = i % 3 === 0 ? 72 : 77;
    const x1 = 100 + outerR * Math.cos(angle);
    const y1 = 100 + outerR * Math.sin(angle);
    const x2 = 100 + innerR * Math.cos(angle);
    const y2 = 100 + innerR * Math.sin(angle);
    hourTicks.appendChild(createSvgLine(x1, y1, x2, y2, i % 3 === 0 ? 1 : 0.65));
  }

  for (let i = 0; i < 60; i += 1) {
    if (i % 5 === 0) {
      continue;
    }

    const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const outerR = 82;
    const innerR = 79;
    const x1 = 100 + outerR * Math.cos(angle);
    const y1 = 100 + outerR * Math.sin(angle);
    const x2 = 100 + innerR * Math.cos(angle);
    const y2 = 100 + innerR * Math.sin(angle);
    minuteTicks.appendChild(createSvgLine(x1, y1, x2, y2, 0.4));
  }

  heroClockStarted = true;

  const updateClock = () => {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const sDeg = (seconds / 60) * 360;
    const mDeg = (minutes / 60) * 360;
    const hDeg = (hours / 12) * 360;

    const sHand = document.getElementById("clock-seconds");
    const mHand = document.getElementById("clock-minute");
    const hHand = document.getElementById("clock-hour");

    if (sHand) sHand.setAttribute("transform", `rotate(${sDeg}, 100, 100)`);
    if (mHand) mHand.setAttribute("transform", `rotate(${mDeg}, 100, 100)`);
    if (hHand) hHand.setAttribute("transform", `rotate(${hDeg}, 100, 100)`);

    requestAnimationFrame(updateClock);
  };

  requestAnimationFrame(updateClock);
};

const conditionClass = (condition) =>
  condition === "Unworn" ? "condition-pill is-unworn" : "condition-pill is-muted";

function animatePrice(el, targetPrice) {
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * targetPrice);

    el.textContent = `€ ${current.toLocaleString("nl-NL")}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `€ ${targetPrice.toLocaleString("nl-NL")}`;
      el.style.transition = "opacity 0.15s ease";
      el.style.opacity = "0.5";
      window.setTimeout(() => {
        el.style.opacity = "1";
      }, 150);
    }
  }

  requestAnimationFrame(update);
}

function initPriceAnimations(scope = document) {
  if (!("IntersectionObserver" in window)) {
    scope.querySelectorAll(".product-card").forEach((card) => {
      const priceEl = card.querySelector(".card-price");
      const rawPrice = Number(card.dataset.price);

      if (priceEl && rawPrice && !card.dataset.animated) {
        card.dataset.animated = "true";
        animatePrice(priceEl, rawPrice);
      }
    });
    return;
  }

  if (!priceObserver) {
    priceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const priceEl = card.querySelector(".card-price");
            const rawPrice = Number(card.dataset.price);

            if (priceEl && rawPrice && !card.dataset.animated) {
              card.dataset.animated = "true";
              animatePrice(priceEl, rawPrice);
            }

            priceObserver.unobserve(card);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );
  }

  scope.querySelectorAll(".product-card").forEach((card) => {
    if (!card.dataset.animated) {
      priceObserver.observe(card);
    }
  });
}

const watchCardTemplate = (product) => `
  <article class="watch-card product-card reveal is-visible" data-brand="${product.brandSlug}" data-id="${product.id}" data-price="${product.price}">
    <div class="watch-visual">
      <span class="${conditionClass(product.condition)}">${product.condition}</span>
      ${
        product.image
          ? `<img class="watch-product-image" src="${product.image}" alt="${product.brand} ${product.model}" />`
          : `<div class="watch-illustration"><span class="watch-shape"></span></div>`
      }
    </div>
    <div class="watch-content">
      <p class="watch-brand">${product.brand}</p>
      <h2>${product.model}</h2>
      <p class="watch-ref">Ref. ${product.ref}</p>
      <div class="price-row">
        <span class="watch-price card-price">€ 0</span>
        <span class="price-arrow">→</span>
      </div>
    </div>
  </article>
`;

if (faviconLink) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#080810";
    context.fillRect(0, 0, 64, 64);
    context.strokeStyle = "#a8c4d4";
    context.lineWidth = 1;
    context.strokeRect(10, 10, 44, 44);
    context.fillStyle = "#a8c4d4";
    context.font = "500 22px Inter, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("WF", 32, 34);
    faviconLink.href = canvas.toDataURL("image/png");
  }
}

if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (!link) {
    return;
  }

  const href = link.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    link.target === "_blank" ||
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const url = new URL(link.href, window.location.href);

  if (url.origin !== window.location.origin || url.href === window.location.href) {
    return;
  }

  event.preventDefault();
  navigateWithSpinner(url.href);
});

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((item) => revealObserver.observe(item));
} else {
  revealElements.forEach((item) => item.classList.add("is-visible"));
}

if (page === "home") {
  initHeroClock();
  const featuredGrid = document.querySelector("#featured-grid");

  if (featuredGrid) {
    featuredGrid.innerHTML = products.slice(0, 3).map(watchCardTemplate).join("");
    initPriceAnimations(featuredGrid);
    featuredGrid.querySelectorAll(".watch-card").forEach((card) => {
      card.addEventListener("click", () => {
        navigateWithSpinner(`product.html?id=${card.dataset.id}`);
      });
    });
  }
}

if (page === "collection") {
  const collectionGrid = document.querySelector("#collection-grid");
  const filterTabs = document.querySelectorAll(".filter-tab");

  if (collectionGrid) {
    collectionGrid.innerHTML = products.map(watchCardTemplate).join("");
    const gridSpinner = document.createElement("div");
    gridSpinner.className = "grid-spinner";
    gridSpinner.innerHTML = spinnerMarkup();
    collectionGrid.appendChild(gridSpinner);
    initPriceAnimations(collectionGrid);

    const cards = Array.from(collectionGrid.querySelectorAll(".watch-card"));

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        navigateWithSpinner(`product.html?id=${card.dataset.id}`);
      });
    });

    const applyFilter = (filter) => {
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.brand === filter;
        card.classList.toggle("is-hidden", !match);
      });
    };

    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;

        filterTabs.forEach((item) => item.classList.remove("is-active"));
        tab.classList.add("is-active");
        gridSpinner.classList.add("visible");
        window.setTimeout(() => {
          applyFilter(filter);
          gridSpinner.classList.remove("visible");
          window.setTimeout(() => initPriceAnimations(collectionGrid), 50);
        }, 200);
      });
    });
  }
}

if (page === "product") {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id")) || 1;
  const product = products.find((item) => item.id === productId) || products[0];

  const brand = document.querySelector("#product-brand");
  const model = document.querySelector("#product-model");
  const ref = document.querySelector("#product-ref");
  const condition = document.querySelector("#detail-condition");
  const year = document.querySelector("#detail-year");
  const movement = document.querySelector("#detail-movement");
  const caseMaterial = document.querySelector("#detail-case");
  const box = document.querySelector("#detail-box");
  const price = document.querySelector("#product-price");
  const description = document.querySelector("#product-description");
  const purchaseButton = document.querySelector("#purchase-button");
  const questionButton = document.querySelector("#question-button");
  const mainImage = document.querySelector("#product-main-image");
  const mainIllustration = document.querySelector("#product-main-illustration");
  const thumbnails = [
    document.querySelector("#thumb-1-image"),
    document.querySelector("#thumb-2-image"),
    document.querySelector("#thumb-3-image"),
  ];
  const thumbnailIllustrations = [
    document.querySelector("#thumb-1-illustration"),
    document.querySelector("#thumb-2-illustration"),
    document.querySelector("#thumb-3-illustration"),
  ];

  if (brand) brand.textContent = product.brand.toUpperCase();
  if (model) model.textContent = product.model;
  if (ref) ref.textContent = `Ref. ${product.ref}`;
  if (condition) condition.textContent = product.condition;
  if (year) year.textContent = String(product.year);
  if (movement) movement.textContent = product.movement;
  if (caseMaterial) caseMaterial.textContent = product.caseMaterial;
  if (box) box.textContent = product.boxPapers;
  if (price) price.textContent = formatPrice(product.price);
  if (description) description.textContent = product.desc;

  if (price) {
    price.textContent = "€ 0";
    window.setTimeout(() => {
      animatePrice(price, product.price);
    }, 280);
  }

  if (product.image && mainImage && mainIllustration) {
    mainImage.src = product.image;
    mainImage.alt = `${product.brand} ${product.model}`;
    mainImage.classList.remove("is-hidden");
    mainIllustration.classList.add("is-hidden");
  }

  thumbnails.forEach((thumbnail, index) => {
    const illustration = thumbnailIllustrations[index];

    if (!thumbnail || !illustration) {
      return;
    }

    if (product.image) {
      thumbnail.src = product.image;
      thumbnail.alt = `${product.brand} ${product.model}`;
      thumbnail.classList.remove("is-hidden");
      illustration.classList.add("is-hidden");
    }
  });

  if (purchaseButton) {
    purchaseButton.href = `mailto:info@watchflow.nl?subject=${encodeURIComponent(
      `Purchase: ${product.model}`
    )}&body=${encodeURIComponent(
      `Hi, I want to purchase the ${product.model} (Ref. ${product.ref}) listed at ${formatPrice(product.price)}.`
    )}`;
  }

  if (questionButton) {
    questionButton.href = `https://wa.me/31600000000?text=${encodeURIComponent(
      `Hi, ik heb een vraag over de ${product.model}`
    )}`;
    questionButton.target = "_blank";
    questionButton.rel = "noreferrer";
  }
}

if (page === "verkoop") {
  const sellForm = document.querySelector(".sell-form");
  const submitButton = document.querySelector(".submit-button");

  if (sellForm && submitButton) {
    sellForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (submitButton.dataset.state === "loading") {
        return;
      }

      submitButton.dataset.state = "loading";
      submitButton.classList.add("is-loading");
      submitButton.disabled = true;
      submitButton.innerHTML = spinnerMarkup();

      window.setTimeout(() => {
        submitButton.dataset.state = "success";
        submitButton.classList.remove("is-loading");
        submitButton.classList.add("is-success");
        submitButton.innerHTML = "Aanbieding verstuurd ✓";
      }, 1500);
    });
  }
}
