const normalizeProduct = (product, index = 0) => ({
  id: product.id ?? product.handle ?? index + 1,
  handle: product.handle ?? String(product.id ?? index + 1),
  brand: product.brand ?? product.vendor ?? "Watch Flow",
  brandSlug:
    product.brandSlug ??
    (product.brand ?? product.vendor ?? "watch-flow")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  model: product.model ?? product.title ?? "Untitled Piece",
  ref: product.ref ?? product.reference ?? "On Request",
  price: Number(product.price ?? 0),
  condition: product.condition ?? "Available",
  year: product.year ?? "On Request",
  desc: product.desc ?? product.description ?? "Detailed product information will appear here once Shopify inventory is connected.",
  movement: product.movement ?? "On Request",
  caseMaterial: product.caseMaterial ?? product.case_material ?? "On Request",
  boxPapers: product.boxPapers ?? product.box_papers ?? "On Request",
  image:
    product.image ??
    product.featuredImage?.url ??
    product.featuredImage?.src ??
    product.featuredImage ??
    product.featured_image?.url ??
    product.featured_image?.src ??
    product.featured_image ??
    "",
});

const shopifyProducts = Array.isArray(window.__WATCHFLOW_PRODUCTS__) ? window.__WATCHFLOW_PRODUCTS__ : [];
const products = shopifyProducts.map(normalizeProduct);

const page = document.body.dataset.page;
const navbar = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const faviconLink = document.querySelector("#dynamic-favicon");
let pageSpinnerOverlay = null;

const formatPrice = (value) => `€ ${value.toLocaleString("nl-NL")}`;
let heroClockStarted = false;
let priceObserver = null;
let scrollAnimationObserver = null;

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

const emptyStateMarkup = ({
  kicker = "Coming Soon",
  title,
  text,
  actionHref = "contact.html",
  actionLabel = "Contact Watch Flow",
}) => `
  <div class="empty-state-card">
    <p class="section-kicker">${kicker}</p>
    <h3>${title}</h3>
    <p>${text}</p>
    <a class="button secondary-button empty-state-button" href="${actionHref}">${actionLabel}</a>
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

function initScrollAnimations(scope = document) {
  if (!("IntersectionObserver" in window)) {
    scope.querySelectorAll(".fade-in, .fade-up").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  if (!scrollAnimationObserver) {
    scrollAnimationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            scrollAnimationObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );
  }

  scope.querySelectorAll(".product-card.fade-up").forEach((card) => {
    if (!card.classList.contains("is-visible")) {
      scrollAnimationObserver.observe(card);
    }
  });
}

function initHeroSequence() {
  const heroBadge = document.querySelector(".hero-badge.fade-in");
  const heroHeading = document.querySelector(".hero h1.fade-up");
  const heroSubtext = document.querySelector(".hero-subtext.fade-in");
  const heroActions = document.querySelector(".hero-actions.fade-up");

  [
    { element: heroBadge, delay: 300 },
    { element: heroHeading, delay: 500 },
    { element: heroSubtext, delay: 700 },
    { element: heroActions, delay: 900 },
  ].forEach(({ element, delay }) => {
    if (element) {
      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, delay);
    }
  });
}

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
      el.style.color = "#2C5F7F";
      el.style.transition = "opacity 0.15s ease, transform 0.18s ease";
      el.style.opacity = "0.5";
      el.style.transform = "scale(1.03)";
      window.setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
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

const watchCardTemplate = (product, index = 0) => `
  <article class="watch-card product-card fade-up stagger-${(index % 6) + 1}" data-brand="${product.brandSlug}" data-id="${product.handle || product.id}" data-price="${product.price}">
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
  initHeroSequence();
  const featuredGrid = document.querySelector("#featured-grid");
  const featuredSection = document.querySelector(".featured-section");
  const featuredLink = document.querySelector(".featured-section .view-link");

  if (featuredGrid) {
    if (products.length) {
      featuredGrid.innerHTML = products.slice(0, 3).map((product, index) => watchCardTemplate(product, index)).join("");
      initScrollAnimations(featuredGrid);
      initPriceAnimations(featuredGrid);
      featuredGrid.querySelectorAll(".watch-card").forEach((card) => {
        card.addEventListener("click", () => {
          navigateWithSpinner(`product.html?id=${card.dataset.id}`);
        });
      });
    } else {
      featuredGrid.classList.add("is-empty-grid");
      featuredGrid.innerHTML = emptyStateMarkup({
        kicker: "Shopify Ready",
        title: "Collection items will appear here once the store inventory is connected.",
        text: "The homepage is ready for dynamic featured products. As soon as Shopify products are available, selected pieces can be surfaced here automatically.",
        actionHref: "contact.html",
        actionLabel: "Get In Touch",
      });
      if (featuredLink) featuredLink.style.display = "none";
      if (featuredSection) featuredSection.classList.add("is-empty-section");
    }
  }
}

if (page === "collection") {
  const collectionGrid = document.querySelector("#collection-grid");
  const collectionControls = document.querySelector(".collection-controls");

  if (collectionGrid) {
    if (!products.length) {
      collectionGrid.classList.add("is-empty-grid");
      collectionGrid.innerHTML = emptyStateMarkup({
        kicker: "Collection Pending",
        title: "No watches are currently published.",
        text: "This collection page is ready for Shopify. Once products are added in the store, filters and sorting will populate automatically.",
        actionHref: "contact.html",
        actionLabel: "Contact Watch Flow",
      });
      if (collectionControls) collectionControls.classList.add("is-hidden");
      return;
    }

    collectionGrid.innerHTML = products.map((product, index) => watchCardTemplate(product, index)).join("");
    const gridSpinner = document.createElement("div");
    gridSpinner.className = "grid-spinner";
    gridSpinner.innerHTML = spinnerMarkup();
    collectionGrid.appendChild(gridSpinner);
    initScrollAnimations(collectionGrid);
    initPriceAnimations(collectionGrid);

    const cards = Array.from(collectionGrid.querySelectorAll(".watch-card"));

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        navigateWithSpinner(`product.html?id=${card.dataset.id}`);
      });
    });

    let activeBrand = "all";
    let activeSort = "price-high";

    const brandControl = document.getElementById("brand-control");
    const brandTrigger = document.getElementById("brand-trigger");
    const brandDropdown = document.getElementById("brand-dropdown");
    const brandLabel = document.getElementById("brand-label");
    const sortTrigger = document.getElementById("sort-trigger");
    const sortDropdown = document.getElementById("sort-dropdown");
    const sortLabel = document.getElementById("sort-label");
    const sortOptions = document.querySelectorAll(".sort-option");

    if (brandDropdown) {
      const uniqueBrands = [...new Map(products.map((product) => [product.brandSlug, product.brand])).entries()];
      brandDropdown.innerHTML = [
        '<button class="brand-option is-active" type="button" data-brand="all">All Watches</button>',
        ...uniqueBrands.map(
          ([slug, name]) =>
            `<button class="brand-option" type="button" data-brand="${slug}">${name}</button>`
        ),
      ].join("");
    }

    const brandOptions = document.querySelectorAll(".brand-option");

    const filterProducts = () => {
      cards.forEach((card) => {
        const match = activeBrand === "all" || card.dataset.brand === activeBrand;
        card.classList.toggle("is-hidden", !match);
      });
    };

    const applySort = () => {
      const sorted = [...cards].sort((a, b) => {
        const pa = Number(a.dataset.price);
        const pb = Number(b.dataset.price);
        return activeSort === "price-high" ? pb - pa : pa - pb;
      });
      sorted.forEach((card) => collectionGrid.insertBefore(card, gridSpinner));
    };

    const runWithSpinner = (fn) => {
      gridSpinner.classList.add("visible");
      window.setTimeout(() => {
        fn();
        gridSpinner.classList.remove("visible");
        window.setTimeout(() => initScrollAnimations(collectionGrid), 50);
        window.setTimeout(() => initPriceAnimations(collectionGrid), 50);
      }, 200);
    };

    applySort();
    filterProducts();

    if (brandTrigger && brandDropdown) {
      brandTrigger.addEventListener("click", () => {
        const isOpen = brandDropdown.hidden === false;
        brandDropdown.hidden = isOpen;
        brandTrigger.setAttribute("aria-expanded", String(!isOpen));
      });

      brandOptions.forEach((option) => {
        option.addEventListener("click", () => {
          activeBrand = option.dataset.brand;
          brandLabel.textContent = option.textContent.toUpperCase();
          brandOptions.forEach((item) => item.classList.remove("is-active"));
          option.classList.add("is-active");
          brandDropdown.hidden = true;
          brandTrigger.setAttribute("aria-expanded", "false");
          runWithSpinner(filterProducts);
        });
      });
    }

    if (sortTrigger && sortDropdown) {
      sortTrigger.addEventListener("click", () => {
        const isOpen = sortDropdown.hidden === false;
        sortDropdown.hidden = isOpen;
        sortTrigger.setAttribute("aria-expanded", String(!isOpen));
      });

      sortOptions.forEach((option) => {
        option.addEventListener("click", () => {
          activeSort = option.dataset.sort;
          sortLabel.textContent = option.textContent;
          sortOptions.forEach((o) => o.classList.remove("is-active"));
          option.classList.add("is-active");
          sortDropdown.hidden = true;
          sortTrigger.setAttribute("aria-expanded", "false");
          runWithSpinner(applySort);
        });
      });

      document.addEventListener("click", (e) => {
        if (brandControl && !brandControl.contains(e.target)) {
          brandDropdown.hidden = true;
          brandTrigger.setAttribute("aria-expanded", "false");
        }
        if (!document.getElementById("sort-control").contains(e.target)) {
          sortDropdown.hidden = true;
          sortTrigger.setAttribute("aria-expanded", "false");
        }
      });
    }
  }
}

if (page === "product") {
  if (!products.length) {
    const productLayout = document.querySelector("#product-layout");
    if (productLayout) {
      productLayout.classList.add("product-layout-empty");
      productLayout.innerHTML = emptyStateMarkup({
        kicker: "Product Pending",
        title: "No product is currently selected.",
        text: "The product detail page is prepared for Shopify-driven inventory. When products are published, this page can render the selected watch automatically.",
        actionHref: "collection.html",
        actionLabel: "Back to Collection",
      });
    }
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productKey = params.get("id");
  const product =
    products.find((item) => String(item.handle || item.id) === String(productKey)) ||
    products[0];

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
      `Hi, I have a question about the ${product.model}`
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
        submitButton.innerHTML = "Offer sent ✓";
      }, 1500);
    });
  }
}
