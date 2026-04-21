// Vercel Serverless Function - Shopify Public Products Proxy
const SHOP = process.env.SHOPIFY_SHOP || 'watch-flow-7721.myshopify.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(`https://${SHOP}/products.json?limit=250`);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Shopify returned ${response.status}` });
    }

    const data = await response.json();

    const products = data.products.map(p => ({
      id: `gid://shopify/Product/${p.id}`,
      title: p.title,
      description: p.body_html?.replace(/<[^>]+>/g, '') || '',
      price: parseFloat(p.variants[0]?.price || 0),
      currency: 'EUR',
      images: p.images.map(img => img.src),
      inStock: p.variants.some(v => v.available),
      tags: p.tags ? p.tags.split(', ') : []
    }));

    return res.status(200).json({ products });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
