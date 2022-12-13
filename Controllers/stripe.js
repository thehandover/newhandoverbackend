import Stripe from 'stripe';

//const stripe = Stripe('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');

//const stripe = Stripe(process.env.STRIPE_SECRET);
const stripe = Stripe(process.env.STRIPE_TEST_SECRET);

const stripePayment = options => {
    console.log("here options" , options)
    return new Promise((resolve, reject) => {
        stripe.paymentIntents
            .create(options)
            .then(charge => {
                if (charge.status !== 'succeeded') {
                    reject(new Error(charge.status));
                } else {
                    resolve(true);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

export default { stripePayment };