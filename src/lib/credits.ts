import type { edgedb } from "$db/imports";
import type { Transaction } from "edgedb/dist/transaction";
import e from '$db';
/**
 * This file contains commonly-used functions involving credits
 */
interface Posting {
    accountId: string,
    amount: number,
}
export async function insertCreditTransaction(postings: Array<Posting>, tx: Transaction, notes?: string) {

    // query to insert all postings and transaction
    const creditTransactionQuery = e.params({ postings: e.array(e.tuple({ amount: e.int64, accountId: e.uuid })) }, (params) => {
        return e.insert(e.CreditTransaction, {
            postings: e.for(e.array_unpack(params.postings), (item) => {
                return e.insert(e.Posting, {
                    account: e.select(e.BillingAccount, ba => ({ filter_single: { id: item.accountId } })),
                    amount: item.amount
                });
            }),
            notes
        })
    });

    const { id: insertedTransacId } = await creditTransactionQuery.run(tx, {
        postings
    });


    // update account balances
    const updateBalanceQuery = e.params({ postings: e.array(e.tuple({ amount: e.int64, accountId: e.uuid })) }, (params) => {
        return e.for(e.array_unpack(params.postings), (item) => {
            return e.update(e.BillingAccount, ba => ({
                filter_single: { id: item.accountId },
                set: {
                    balance: e.op(ba.balance, '+', item.amount)
                }
            }));
        })
    });

    await updateBalanceQuery.run(tx, { postings });

    return insertedTransacId;
}