
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (req, res) => {

  const session = await stripe.billingPortal.sessions.create({
    customer: req.params.stripeCustomerId,
    return_url: 'https://slapper.io/app/settings', });

  res.redirect(session.url);
  // res.send("ok")
}
