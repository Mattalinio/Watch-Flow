/* ==========================================================================
   REZN — i18n (NL / EN)
   Single dictionary for all UI + brand copy. Choice persists in localStorage.
   HTML uses:
     data-i18n="key"            -> textContent
     data-i18n-html="key"       -> innerHTML (allows <br>, <b>)
     data-i18n-placeholder="key"-> placeholder attribute
   In Shopify this maps to locale files (en.json / nl.json).
   ========================================================================== */
(function () {
  "use strict";

  const DICT = {
    /* Announcement bar */
    "ann.delivery": { nl: "Worldwide delivery", en: "Worldwide delivery" },
    "ann.shipping": { nl: "Fast shipping", en: "Fast shipping" },
    "ann.returns":  { nl: "Easy returns", en: "Easy returns" },
    "ann.summer":   { nl: "Nieuwe zomercollectie nu uit", en: "New summer collection out now" },
    "ann.freeship": { nl: "Gratis verzending vanaf €75", en: "Free shipping over €75" },

    /* Nav */
    "nav.newin":       { nl: "New In", en: "New In" },
    "nav.tops":        { nl: "Tops", en: "Tops" },
    "nav.bottoms":     { nl: "Bottoms", en: "Bottoms" },
    "nav.outerwear":   { nl: "Outerwear", en: "Outerwear" },
    "nav.accessories": { nl: "Accessories", en: "Accessories" },
    "nav.sale":        { nl: "Sale", en: "Sale" },

    /* Hero */
    "hero.eyebrow": { nl: "Resonance & Resilience", en: "Resonance & Resilience" },
    "hero.title":   { nl: "Vormt<br>onder<br>druk", en: "Forged<br>under<br>pressure" },
    "hero.sub":     { nl: "Streetwear voor wie is opgebouwd uit tegenslag. Niet ondanks de druk — dankzij.", en: "Streetwear for those built by adversity. Not despite the pressure — because of it." },
    "hero.cta1":    { nl: "Shop de collectie", en: "Shop the collection" },
    "hero.cta2":    { nl: "Ons verhaal", en: "Our story" },

    /* USP */
    "usp.delivery": { nl: "Worldwide delivery", en: "Worldwide delivery" },
    "usp.shipping": { nl: "Fast shipping", en: "Fast shipping" },
    "usp.returns":  { nl: "Easy returns", en: "Easy returns" },
    "usp.checkout": { nl: "Secure checkout", en: "Secure checkout" },

    /* Sections */
    "sec.shopcat":        { nl: "Shop op categorie", en: "Shop by category" },
    "sec.viewall":        { nl: "Bekijk alles", en: "View all" },
    "sec.bestsellers":    { nl: "Bestsellers", en: "Bestsellers" },
    "sec.allbestsellers": { nl: "Alle bestsellers", en: "All bestsellers" },
    "sec.newin":          { nl: "New in", en: "New in" },
    "sec.allnew":         { nl: "Alle nieuwe items", en: "All new items" },
    "sec.community":      { nl: "Community fits", en: "Community fits" },
    "sec.tag":            { nl: "Tag @rezn", en: "Tag @rezn" },
    "sec.shopcollection": { nl: "Shop de collectie", en: "Shop the collection" },

    /* Category tiles */
    "cat.tops":        { nl: "Tops", en: "Tops" },
    "cat.bottoms":     { nl: "Bottoms", en: "Bottoms" },
    "cat.outerwear":   { nl: "Outerwear", en: "Outerwear" },
    "cat.accessories": { nl: "Accessories", en: "Accessories" },
    "unit.products":   { nl: "producten", en: "products" },

    /* Split blocks */
    "split.new":         { nl: "Nieuw binnen", en: "New in" },
    "split.slides.title":{ nl: "Summer<br>Slides", en: "Summer<br>Slides" },
    "split.slides.sub":  { nl: "Comfort meets street. Beperkte oplage — nu verkrijgbaar.", en: "Comfort meets street. Limited run — available now." },
    "split.slides.cta":  { nl: "Shop slides", en: "Shop slides" },
    "split.capsule":     { nl: "Capsule", en: "Capsule" },
    "split.perf.title":  { nl: "Performance<br>Line", en: "Performance<br>Line" },
    "split.perf.sub":    { nl: "Technische stoffen, minimale naden, maximale beweging.", en: "Technical fabrics, minimal seams, maximum movement." },
    "split.perf.cta":    { nl: "Ontdek capsule", en: "Explore capsule" },

    /* Marquee band */
    "band.text": {
      nl: "Vormt onder druk&nbsp;✳&nbsp;Wat blijft hangen&nbsp;✳&nbsp;Gebouwd om te blijven staan&nbsp;✳&nbsp;Druk maakt vorm&nbsp;✳&nbsp;",
      en: "Forged under pressure&nbsp;✳&nbsp;What stays with you&nbsp;✳&nbsp;Built to stand&nbsp;✳&nbsp;Pressure creates form&nbsp;✳&nbsp;"
    },

    /* Story / about */
    "story.heading": { nl: "Wat blijft<br>hangen", en: "What stays<br>with you" },
    "story.p1": {
      nl: "<b>REZN staat voor resonance en resilience.</b> Voor het soort veerkracht dat je niet leert op school, maar op straat. Voor de impact die blijft hangen nadat jij allang weg bent.",
      en: "<b>Rezn stands for resonance and resilience.</b> For the kind of strength you don't learn in school, but on the street. For the impact that lingers long after you've left the room."
    },
    "story.p2": {
      nl: "We maken kleding voor mensen die zichzelf vormen onder druk — en er sterker uitkomen. Geen filter, geen verwatering. Alleen wat overblijft als de rest wegvalt.",
      en: "We make clothing for people who shape themselves under pressure — and come out stronger. No filter, no dilution. Only what remains when everything else falls away."
    },

    /* Newsletter */
    "nl.eyebrow":     { nl: "Join the club", en: "Join the club" },
    "nl.title":       { nl: "−10% op je<br>eerste order", en: "−10% on your<br>first order" },
    "nl.sub":         { nl: "Schrijf je in voor early access tot drops, exclusieve deals en het laatste nieuws van REZN.", en: "Sign up for early access to drops, exclusive deals and the latest from REZN." },
    "nl.placeholder": { nl: "jouw@email.com", en: "your@email.com" },
    "nl.button":      { nl: "Inschrijven", en: "Subscribe" },

    /* Footer */
    "footer.brandtext": {
      nl: "Resonance & resilience. Streetwear die blijft hangen, net als jij. Gebouwd om te blijven staan.",
      en: "Resonance & resilience. Streetwear that stays with you. Built to stand."
    },
    "footer.shop":           { nl: "Shop", en: "Shop" },
    "footer.help":           { nl: "Help", en: "Help" },
    "footer.brand":          { nl: "Brand", en: "Brand" },
    "footer.shipping":       { nl: "Verzending", en: "Shipping" },
    "footer.returns":        { nl: "Retourneren", en: "Returns" },
    "footer.sizeguide":      { nl: "Maattabel", en: "Size guide" },
    "footer.contact":        { nl: "Contact", en: "Contact" },
    "footer.faq":            { nl: "FAQ", en: "FAQ" },
    "footer.about":          { nl: "Over REZN", en: "About REZN" },
    "footer.stores":         { nl: "Stores", en: "Stores" },
    "footer.careers":        { nl: "Careers", en: "Careers" },
    "footer.sustainability": { nl: "Sustainability", en: "Sustainability" },
    "footer.copyright":      { nl: "© 2026 REZN. Alle rechten voorbehouden.", en: "© 2026 REZN. All rights reserved." },

    /* Breadcrumbs */
    "crumb.home":    { nl: "Home", en: "Home" },
    "crumb.shopall": { nl: "Shop all", en: "Shop all" },
    "crumb.product": { nl: "Product", en: "Product" },

    /* Collection */
    "col.eyebrow": { nl: "De collectie", en: "The collection" },
    "col.title":   { nl: "Shop all", en: "Shop all" },
    "col.intro": {
      nl: "Elk stuk is gebouwd om te blijven. Geen seizoensgebonden hype — silhouetten die standhouden, net als jij.",
      en: "Every piece is built to last. No seasonal hype — silhouettes that hold their ground, just like you."
    },
    "filter.all":         { nl: "Alles", en: "All" },
    "filter.tops":        { nl: "Tops", en: "Tops" },
    "filter.bottoms":     { nl: "Bottoms", en: "Bottoms" },
    "filter.outerwear":   { nl: "Outerwear", en: "Outerwear" },
    "filter.accessories": { nl: "Accessories", en: "Accessories" },
    "sort.featured":  { nl: "Aanbevolen", en: "Featured" },
    "sort.new":       { nl: "Nieuwste", en: "Newest" },
    "sort.priceasc":  { nl: "Prijs: laag → hoog", en: "Price: low → high" },
    "sort.pricedesc": { nl: "Prijs: hoog → laag", en: "Price: high → low" },
    "sort.name":      { nl: "Naam A → Z", en: "Name A → Z" },

    /* Product detail */
    "pdp.color":     { nl: "Kleur", en: "Color" },
    "pdp.size":      { nl: "Maat", en: "Size" },
    "pdp.sizeguide": { nl: "Maattabel", en: "Size guide" },
    "pdp.add":       { nl: "In winkelmandje", en: "Add to cart" },
    "pdp.save":      { nl: "♡ Bewaren", en: "♡ Save" },
    "pdp.selectsize":{ nl: "Kies eerst een maat", en: "Select a size first" },
    "pdp.desc":      { nl: "Beschrijving", en: "Description" },
    "pdp.descbody": {
      nl: "Een essential uit de nieuwe REZN-collectie. Gemaakt van premium, gewassen katoen met een comfortabele, moderne pasvorm. Draagbaar van dag tot nacht, gebouwd om te blijven.",
      en: "An essential from the new REZN collection. Made from premium washed cotton with a comfortable, modern fit. Wearable day to night, built to last."
    },
    "pdp.material":   { nl: "Materiaal & verzorging", en: "Material & care" },
    "pdp.material.li1": { nl: "100% biologisch katoen, 220 g/m²", en: "100% organic cotton, 220 gsm" },
    "pdp.material.li2": { nl: "Voorgewassen — minimale krimp", en: "Pre-washed — minimal shrinkage" },
    "pdp.material.li3": { nl: "Machinewas 30°C, binnenstebuiten", en: "Machine wash 30°C, inside out" },
    "pdp.material.li4": { nl: "Niet in de droger", en: "Do not tumble dry" },
    "pdp.shipping":   { nl: "Verzending & retour", en: "Shipping & returns" },
    "pdp.shippingbody": {
      nl: "Gratis verzending vanaf €75. Verzending binnen 1–3 werkdagen. 30 dagen retourrecht op ongedragen artikelen met labels.",
      en: "Free shipping over €75. Ships within 1–3 business days. 30-day returns on unworn items with tags."
    },
    "pdp.related": { nl: "Je vindt dit misschien ook mooi", en: "You might also like" },
    "pdp.shopall": { nl: "Shop all", en: "Shop all" },

    /* Cart drawer */
    "cart.title":    { nl: "Winkelmandje", en: "Cart" },
    "cart.empty":    { nl: "Je mandje is leeg.", en: "Your cart is empty." },
    "cart.total":    { nl: "Totaal", en: "Total" },
    "cart.checkout": { nl: "Afrekenen", en: "Checkout" },
    "cart.remove":   { nl: "Verwijderen", en: "Remove" },

    /* Dynamic (JS) */
    "card.quickadd": { nl: "+ Snel toevoegen", en: "+ Quick add" },
  };

  const LANG_KEY = "rezn_lang";
  let lang = localStorage.getItem(LANG_KEY) || "nl";
  if (lang !== "nl" && lang !== "en") lang = "nl";

  function t(key) {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] != null ? entry[lang] : entry.nl;
  }

  function apply(root) {
    const ctx = root || document;
    ctx.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    ctx.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    ctx.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.documentElement.lang = lang;
    // Reflect active state on any language toggles
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-lang") === lang);
    });
  }

  function setLang(next) {
    if (next !== "nl" && next !== "en") return;
    if (next === lang) return;
    localStorage.setItem(LANG_KEY, next);
    // Full reload keeps static + dynamic (cart, grids) perfectly in sync.
    location.reload();
  }

  // Wire up toggles + apply static translations immediately (scripts sit at end of body)
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-set-lang")));
  });

  window.I18N = { get lang() { return lang; }, t, apply, setLang };
  apply();
})();
