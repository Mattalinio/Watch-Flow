// Vercel Serverless Function - Shopify Proxy
const SHOP = process.env.SHOPIFY_SHOP || 'watch-flow-7721.myshopify.com';
const TOKEN = process.env.SHOPIFY_TOKEN;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const query = `{
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
            tags
          }
        }
      }
    }`;

    const response = await fetch(`https://${SHOP}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(500).json({ error: data.errors });
    }

    // Map to simple format
    const products = data.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      price: parseFloat(node.priceRangeV2.minVariantPrice.amount),
      currency: node.priceRangeV2.minVariantPrice.currencyCode,
      images: node.images.edges.map(img => img.node.url),
      inStock: node.variants.edges[0]?.node.availableForSale || false,
      tags: node.tags
    }));

    return res.status(200).json({ products });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
