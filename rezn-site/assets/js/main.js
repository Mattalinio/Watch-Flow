/* ==========================================================================
   REZN — interactions
   Cart drawer, mobile nav, product grids, collection filter/sort, PDP.
   Vanilla JS, no dependencies. Cart persists in localStorage.
   ========================================================================== */
(function () {
  "use strict";
  const R = window.REZN;
  const t = (key) => (window.I18N ? window.I18N.t(key) : key);
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Cart state (localStorage) ---------------------------------- */
  const CART_KEY = "rezn_cart";
  const loadCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  };
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));
  let cart = loadCart();

  function addToCart(id, size, color) {
    const p = R.byId(id);
    if (!p) return;
    const key = `${id}|${size || "-"}|${color || "-"}`;
    const existing = cart.find((l) => l.key === key);
    if (existing) existing.qty += 1;
    else cart.push({ key, id, size: size || null, color: color || null, qty: 1 });
    saveCart(cart);
    renderCart();
    openCart();
  }

  function removeLine(key) {
    cart = cart.filter((l) => l.key !== key);
    saveCart(cart);
    renderCart();
  }

  function renderCart() {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    $$("[data-cart-count]").forEach((el) => (el.textContent = count));

    const body = $("[data-cart-body]");
    const totalEl = $("[data-cart-total]");
    if (!body) return;

    if (!cart.length) {
      body.innerHTML = `<p class="drawer__empty">${t("cart.empty")}</p>`;
      if (totalEl) totalEl.textContent = R.euro(0);
      return;
    }

    let total = 0;
    body.innerHTML = cart.map((l) => {
      const p = R.byId(l.id);
      const line = p.price * l.qty;
      total += line;
      const meta = [l.color, l.size, `×${l.qty}`].filter(Boolean).join(" · ");
      return `
        <div class="cart-line">
          <span class="cart-line__media u-placeholder" data-label="${p.title}"></span>
          <div class="cart-line__info">
            <div class="t">${p.title}</div>
            <div class="m">${meta}</div>
            <div class="p">${R.euro(line)}</div>
            <button class="cart-line__remove" data-remove="${l.key}">${t("cart.remove")}</button>
          </div>
        </div>`;
    }).join("");
    if (totalEl) totalEl.textContent = R.euro(total);

    $$("[data-remove]", body).forEach((b) =>
      b.addEventListener("click", () => removeLine(b.dataset.remove))
    );
  }

  /* ---------- Drawer / overlay / mobile nav ------------------------------ */
  const overlay = $("[data-overlay]");
  const drawer = $("[data-cart]");
  const mobileNav = $("[data-mobile-nav]");

  function openCart() { drawer && drawer.classList.add("is-open"); overlay && overlay.classList.add("is-open"); }
  function closeAll() {
    drawer && drawer.classList.remove("is-open");
    mobileNav && mobileNav.classList.remove("is-open");
    overlay && overlay.classList.remove("is-open");
  }
  function openNav() { mobileNav && mobileNav.classList.add("is-open"); overlay && overlay.classList.add("is-open"); }

  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
  $$("[data-close-cart]").forEach((b) => b.addEventListener("click", closeAll));
  $$("[data-open-nav]").forEach((b) => b.addEventListener("click", openNav));
  $$("[data-close-nav]").forEach((b) => b.addEventListener("click", closeAll));
  overlay && overlay.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  /* Quick-add buttons (event delegation for injected cards) */
  document.addEventListener("click", (e) => {
    const qa = e.target.closest("[data-quick-add]");
    if (qa) {
      e.preventDefault();
      const p = R.byId(qa.dataset.quickAdd);
      addToCart(qa.dataset.quickAdd, "M", p ? p.colors[0] : null);
    }
  });

  /* ---------- Homepage product grids ------------------------------------- */
  $$("[data-product-grid]").forEach((grid) => {
    const source = grid.dataset.source;
    const list = source === "new" ? R.byTag("new").slice(0, 8) : R.byTag("bestseller").slice(0, 8);
    grid.innerHTML = list.map(R.cardHTML).join("");
  });

  /* ---------- Collection page: filter + sort ----------------------------- */
  const colGrid = $("[data-collection-grid]");
  if (colGrid) {
    let activeFilter = "all";
    let activeSort = "featured";

    function apply() {
      let list = activeFilter === "all" ? R.products.slice() : R.byCat(activeFilter);
      switch (activeSort) {
        case "price-asc":  list.sort((a, b) => a.price - b.price); break;
        case "price-desc": list.sort((a, b) => b.price - a.price); break;
        case "name":       list.sort((a, b) => a.title.localeCompare(b.title)); break;
        case "new":        list = list.filter((p) => p.tags.includes("new")).concat(list.filter((p) => !p.tags.includes("new"))); break;
      }
      colGrid.innerHTML = list.map(R.cardHTML).join("");
      const countEl = $("[data-count]");
      if (countEl) countEl.textContent = `${list.length} ${t("unit.products")}`;
    }

    $$("[data-filter]").forEach((chip) =>
      chip.addEventListener("click", () => {
        $$("[data-filter]").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeFilter = chip.dataset.filter;
        apply();
      })
    );
    const sortSel = $("[data-sort]");
    sortSel && sortSel.addEventListener("change", () => { activeSort = sortSel.value; apply(); });
    apply();
  }

  /* ---------- Product detail page ---------------------------------------- */
  const pdp = $("[data-pdp]");
  if (pdp) {
    const SW = { black:"#141414", white:"#f4f4f2", grey:"#9a9a95", olive:"#5c5b3a", sand:"#c9b79a", navy:"#22263a", acid:"#b7bd6e" };
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || R.products[0].id;
    const p = R.byId(id) || R.products[0];

    document.title = `${p.title} — REZN`;
    $("[data-title]").textContent = p.title;
    $("[data-crumb-title]").textContent = p.title;
    $("[data-gallery-main]").setAttribute("data-label", p.title);
    $("[data-price]").innerHTML = p.compareAt
      ? `<del>${R.euro(p.compareAt)}</del><span class="is-sale">${R.euro(p.price)}</span>`
      : R.euro(p.price);

    // Colors
    let selectedColor = p.colors[0];
    const colorName = $("[data-color-name]");
    const colorWrap = $("[data-colors]");
    const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    colorName.textContent = capital(selectedColor);
    colorWrap.innerHTML = p.colors.map((c, i) =>
      `<button class="color-dot ${i === 0 ? "is-active" : ""}" style="background:${SW[c] || "#ccc"}" data-color="${c}" aria-label="${c}"></button>`
    ).join("");
    $$("[data-color]", colorWrap).forEach((dot) =>
      dot.addEventListener("click", () => {
        $$("[data-color]", colorWrap).forEach((d) => d.classList.remove("is-active"));
        dot.classList.add("is-active");
        selectedColor = dot.dataset.color;
        colorName.textContent = capital(selectedColor);
      })
    );

    // Sizes
    let selectedSize = null;
    $$("[data-sizes] .size").forEach((btn) => {
      if (btn.classList.contains("is-disabled")) return;
      btn.addEventListener("click", () => {
        $$("[data-sizes] .size").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        selectedSize = btn.textContent.trim();
      });
    });

    // Add to cart
    const addBtn = $("[data-add-to-cart]");
    addBtn.addEventListener("click", () => {
      if (!selectedSize) {
        addBtn.textContent = t("pdp.selectsize");
        addBtn.style.background = "var(--c-sale)";
        addBtn.style.borderColor = "var(--c-sale)";
        setTimeout(() => {
          addBtn.textContent = t("pdp.add");
          addBtn.style.background = "";
          addBtn.style.borderColor = "";
        }, 1600);
        return;
      }
      addToCart(p.id, selectedSize, selectedColor);
    });

    // Related products (same category, excl. current)
    const related = R.byCat(p.cat).filter((x) => x.id !== p.id).slice(0, 4);
    const fill = related.length < 4
      ? related.concat(R.products.filter((x) => x.id !== p.id && !related.includes(x)).slice(0, 4 - related.length))
      : related;
    $("[data-related]").innerHTML = fill.map(R.cardHTML).join("");
  }

  /* ---------- Accordions (PDP) ------------------------------------------- */
  $$(".accordion__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      const panel = trigger.nextElementSibling;
      if (panel) panel.setAttribute("data-open", String(!expanded));
    });
  });

  /* ---------- Init ------------------------------------------------------- */
  renderCart();
})();
