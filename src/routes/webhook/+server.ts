
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import stripe from '$lib/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import type { Stripe } from 'stripe';
import { client } from '$lib/edgedb';
import e from '$db';
import { CreditTransaction } from '$db/modules/default';

export const POST: RequestHandler = async ({ request }) => {
    let event: any;
    const signature = request.headers.get("stripe-signature");
    if (!signature) throw error(400, "Stripe private key required");

    const reqBody = await request.text();
    if (!reqBody) throw error(400, "missing request body");

    try {
        event = stripe.webhooks.constructEvent(
            reqBody,
            signature,
            STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        throw error(400, "Webhook signature verification failed.");
    }
    const data = event.data;
    const eventType = event.type;
    console.log("fuck 1!");

    if (eventType == "checkout.session.completed") {

        console.log("asdfasdfasdef  fuck 2222!");
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
                expand: ['line_items', 'line_items.data.price.product'],
            }
        );
        const lineItems = sessionWithLineItems.line_items;

        const numCredits: number = parseInt(lineItems?.data[0].price?.product.metadata.credits!);

        console.log(numCredits);
        const userId = data.object.metadata.user_id!;


        await client.transaction(async tx => {
            const userQuery = e.select(e.auth.User, user => ({ filter_single: { id: userId } }));
            const stripeAccountQuery = e.select(e.BillingAccount, ba => ({ filter_single: e.op(ba.special_account_type, '=', e.SpecialAccount.StripeCheckout) }));

            const updateStripeAccountBalance = e.update(e.BillingAccount, ba => ({
                set: {
                    balance: e.op(ba.balance, '+', numCredits)
                },
                filter_single: { id: stripeAccountQuery.id }
            }));

            const updateUserBalance = e.update(e.BillingAccount, ba => ({
                set: {
                    balance: e.op(ba.balance, '+', numCredits)
                },
                filter_single: { id: userQuery.billing_account.id }
            }));

            const stripeAccountPosting = e.insert(e.Posting, {
                amount: numCredits,
                account: stripeAccountQuery
            });

            const userPosting = e.insert(e.Posting, {
                amount: +numCredits,
                account: userQuery.billing_account
            });

            const creditTransaction = e.insert(e.CreditTransaction, {
                notes: "User credit purchase",
                postings: e.set(stripeAccountPosting, userPosting)
            });

            const insertCreditPurchase = e.insert(e.CreditPurchase, {
                user: userQuery,
                credit_transaction: creditTransaction,
                num_credits: numCredits,
                fiat_paid: lineItems!.data[0].amount_subtotal
            });


            await insertCreditPurchase.run(tx);
            await updateUserBalance.run(tx);
            await updateStripeAccountBalance.run(tx);
        });

    } else if (eventType == "payment_intent.payment_failed") {
        console.log("❌ Payment failed.");
    }
    return new Response();
};