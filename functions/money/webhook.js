
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { q, client } = require("../fauna/faunaClient");

exports.handler = async (req, res) => {
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];



    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {


      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {

    return res.sendStatus(400);
  }

  switch (eventType) {
    case 'checkout.session.completed':
      const { user_id } = data.object.metadata
      console.log('user_id: ', user_id);

      try {
        client
          .query(q.Get(q.Match(q.Index("users_index"), user_id)))
          .then((response) => {
            console.log("response: ", response.ref);
            client
              .query(
                q.Update(
                  response.ref,
                  { data: { plan: "premium" } },
                )
              )
              .then((response) => {
                console.log("user: ", response.data);
              })
          })
      } catch (e) {
        console.log("error", e)
        // Unhandled event type
        return res.sendStatus(400);

      }


      // Payment is successful and the subscription is created.
      // You should provision the subscription.
      break;
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
      // Unhandled event type
      return res.sendStatus(400);
  }

  res.sendStatus(200);
}
