const stripe = require('stripe')(process.env.REACT_APP_SECRET_KEY);


exports.handler = async ( event, context) => { 
  if (event.httpMethod === 'POST') {
    const price = await stripe.prices.retrieve(
      event.body
    );

    const product = await stripe.products.retrieve(
      price.product
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      line_items: [{
        price: price.id,
        quantity: 1,
      }],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: 'https://sosspeakers.com/successfulpaymentredirect',
      cancel_url: 'https://sosspeakers.com/',
    });


    return { statusCode : 200, body : JSON.stringify({session})};}
 }
