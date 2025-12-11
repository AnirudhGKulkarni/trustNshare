const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const crypto = require('crypto');

admin.initializeApp();

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

exports.createRazorpayOrder = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  if (!KEY_ID || !KEY_SECRET) return res.status(500).send('Razorpay keys not configured');

  const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}`, plan, inviteId } = req.body || {};
  if (!amount) return res.status(400).send('Missing amount');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency, receipt, payment_capture: 1, notes: { plan, inviteId } }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).send(data);
    return res.json(data);
  } catch (err) {
    console.error('createRazorpayOrder error', err);
    return res.status(500).send({ error: String(err) });
  }
});

exports.verifyRazorpayPayment = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  if (!KEY_SECRET) return res.status(500).send('Razorpay secret not configured');

  // Expect Authorization: Bearer <Firebase ID Token>
  const authHeader = req.get('Authorization') || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).send('Missing Authorization header');
  const idToken = match[1];

  let uid;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    uid = decoded.uid;
  } catch (e) {
    console.error('verifyIdToken failed', e);
    return res.status(401).send('Invalid ID token');
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, amount, inviteId } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).send('Missing payment fields');

  const generated_signature = crypto.createHmac('sha256', KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (generated_signature !== razorpay_signature) {
    console.warn('Signature mismatch', { generated_signature, razorpay_signature });
    return res.status(400).send('Invalid signature');
  }

  try {
    const firestore = admin.firestore();
    const userRef = firestore.collection('users').doc(uid);
    await userRef.set({
      paid: true,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      plan: plan || null,
      planAmount: amount || null,
      paymentMethod: 'Razorpay',
      paymentInfo: {
        razorpay_order_id,
        razorpay_payment_id,
      },
    }, { merge: true });

    if (inviteId) {
      try {
        await firestore.collection('pricing_invites').doc(inviteId).update({ used: true });
      } catch (e) {
        console.warn('Failed to mark invite used', e);
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Error updating Firestore', err);
    return res.status(500).send({ error: String(err) });
  }
});
