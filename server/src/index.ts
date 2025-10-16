import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { categories, products } from './data';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') ?? '*', credentials: true }));
app.use(express.json());

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', (_req, res) => {
  res.json({ categories });
});

app.get('/api/products', (req, res) => {
  const { categoryId, q } = req.query as { categoryId?: string; q?: string };
  let list = products;
  if (categoryId) list = list.filter(p => p.categoryId === categoryId);
  if (q) {
    const term = q.toString().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }
  res.json({ products: list });
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items, currency } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      currency?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const currencyCode = (currency || 'usd').toLowerCase();

    const amountCents = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return sum;
      const qty = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
      return sum + product.priceCents * qty;
    }, 0);

    if (amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const stripe = new Stripe(stripeSecret);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: currencyCode,
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(items)
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Payment intent error', error);
    res.status(500).json({ error: 'Payment failed to initialize' });
  }
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, currency } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      currency?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const stripe = new Stripe(stripeSecret);

    const successUrl = `${process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'}/checkout?canceled=1`;

    const lineItems = items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const qty = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
        if (qty <= 0) return null;
        return {
          quantity: qty,
          price_data: {
            currency: (currency || 'usd').toLowerCase(),
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.imageUrl]
            },
            unit_amount: product.priceCents
          }
        };
      })
      .filter(Boolean) as any[];

    if (!lineItems.length) {
      return res.status(400).json({ error: 'No valid items' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Checkout session error', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
