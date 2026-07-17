/* ==========================================================================
   REZN — shared catalog
   Single source of truth for products + a card renderer reused on every page.
   In Shopify this maps to product objects; here it's plain JS placeholder data.
   ========================================================================== */
(function () {
  "use strict";

  // Placeholder swatch colors (visual only)
  const SW = {
    black: "#141414", white: "#f4f4f2", grey: "#9a9a95",
    olive: "#5c5b3a", sand: "#c9b79a", navy: "#22263a", acid: "#b7bd6e",
  };

  const PRODUCTS = [
    { id: "rezn-40-tee",       title: "REZN 40 Tee",            cat: "tops",       price: 45, colors: ["black","white","grey"], badge: "new",  tags: ["new","bestseller"] },
    { id: "wrap-shades",       title: "Wrap Shades",            cat: "accessories",price: 129,colors: ["black","olive"],         badge: null,   tags: ["bestseller"] },
    { id: "slim-tee",          title: "Slim Basic Tee",         cat: "tops",       price: 29, colors: ["black","white","sand"],  badge: null,   tags: ["bestseller","basics"] },
    { id: "performance-shorts",title: "Performance Shorts",     cat: "bottoms",    price: 59, colors: ["black","navy"],          badge: null,   tags: ["new","bestseller"] },
    { id: "rezn-slides",       title: "Summer Slides",          cat: "accessories",price: 49, colors: ["black","white"],         badge: "new",  tags: ["new"] },
    { id: "boxy-hoodie",       title: "Boxy Logo Hoodie",       cat: "tops",       price: 89, colors: ["black","grey","olive"],  badge: null,   tags: ["bestseller"] },
    { id: "cargo-pant",        title: "Utility Cargo Pant",     cat: "bottoms",    price: 99, colors: ["black","olive","sand"],  badge: "new",  tags: ["new"] },
    { id: "bomber-jacket",     title: "Nylon Bomber Jacket",    cat: "outerwear",  price: 179,colors: ["black","navy"],          badge: null,   tags: ["bestseller"] },
    { id: "knit-polo",         title: "Summer Knit Polo",       cat: "tops",       price: 69, colors: ["sand","navy","black"],   badge: "new",  tags: ["new"] },
    { id: "mesh-short",        title: "Mesh Training Short",    cat: "bottoms",    price: 45, colors: ["black","acid"],          badge: null,   tags: ["new"] },
    { id: "trucker-cap",       title: "Logo Trucker Cap",       cat: "accessories",price: 35, colors: ["black","white","olive"], badge: null,   tags: ["basics"] },
    { id: "denim-jacket",      title: "Washed Denim Jacket",    cat: "outerwear",  price: 149,colors: ["navy","grey"],           badge: null,   tags: ["bestseller"] },
    { id: "track-pant",        title: "Tech Track Pant",        cat: "bottoms",    price: 79, colors: ["black","grey"],          badge: null,   tags: ["new"], compareAt: 99 },
    { id: "longsleeve",        title: "Ribbed Longsleeve",      cat: "tops",       price: 49, colors: ["white","black","sand"],  badge: null,   tags: ["basics"] },
    { id: "puffer",            title: "Cropped Puffer",         cat: "outerwear",  price: 199,colors: ["black","olive"],         badge: null,   tags: ["bestseller"], compareAt: 249 },
    { id: "crew-socks",        title: "Ribbed Crew Socks",      cat: "accessories",price: 15, colors: ["black","white"],         badge: null,   tags: ["basics"] },
    { id: "beanie",            title: "Cuffed Beanie",          cat: "accessories",price: 25, colors: ["black","grey","acid"],   badge: null,   tags: ["basics"] },
    { id: "jersey-tee",        title: "Football Jersey Tee",    cat: "tops",       price: 55, colors: ["white","navy"],          badge: "new",  tags: ["new"] },
    { id: "chino-short",       title: "Pleated Chino Short",    cat: "bottoms",    price: 59, colors: ["sand","black","olive"],  badge: null,   tags: ["new"] },
    { id: "leather-jacket",    title: "Moto Leather Jacket",    cat: "outerwear",  price: 349,colors: ["black"],                 badge: null,   tags: ["bestseller"] },
    { id: "canvas-tote",       title: "Canvas Tote Bag",        cat: "accessories",price: 39, colors: ["sand","black"],          badge: null,   tags: ["basics"] },
    { id: "graphic-tee",       title: "Backprint Graphic Tee",  cat: "tops",       price: 45, colors: ["black","white"],         badge: null,   tags: ["new","bestseller"] },
    { id: "denim-jean",        title: "Loose Fit Jean",         cat: "bottoms",    price: 109,colors: ["navy","grey"],           badge: null,   tags: ["new"] },
    { id: "coach-jacket",      title: "Coach Jacket",           cat: "outerwear",  price: 119,colors: ["black","olive"],         badge: "new",  tags: ["new"] },
  ];

  const euro = (n) => "€" + n.toLocaleString("nl-NL");

  function swatchDots(colors) {
    return colors.map((c) =>
      `<span class="swatch" style="background:${SW[c] || "#ccc"}" title="${c}"></span>`
    ).join("");
  }

  function cardHTML(p) {
    const badge = p.badge
      ? `<span class="card__badge is-${p.badge}">${p.badge === "new" ? "New" : p.badge}</span>`
      : (p.compareAt ? `<span class="card__badge is-sale">Sale</span>` : "");
    const price = p.compareAt
      ? `<span class="card__price"><del>${euro(p.compareAt)}</del><span class="is-sale">${euro(p.price)}</span></span>`
      : `<span class="card__price">${euro(p.price)}</span>`;

    return `
      <article class="card" data-id="${p.id}">
        <a class="card__media" href="product.html?id=${p.id}">
          ${badge}
          <span class="u-placeholder" data-label="${p.title}"></span>
          <div class="card__quick">
            <button class="btn btn--block" data-quick-add="${p.id}">${window.I18N ? window.I18N.t("card.quickadd") : "+ Snel toevoegen"}</button>
          </div>
        </a>
        <a href="product.html?id=${p.id}">
          <div class="card__meta">
            <h3 class="card__title">${p.title}</h3>
            ${price}
          </div>
        </a>
        <div class="card__swatches">${swatchDots(p.colors)}</div>
      </article>`;
  }

  window.REZN = {
    products: PRODUCTS,
    euro,
    cardHTML,
    byId: (id) => PRODUCTS.find((p) => p.id === id),
    byTag: (tag) => PRODUCTS.filter((p) => p.tags.includes(tag)),
    byCat: (cat) => PRODUCTS.filter((p) => p.cat === cat),
  };
})();
