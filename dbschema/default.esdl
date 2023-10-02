module default {

    type Game {
        required title: str;
        # id for querying https://www.igdb.com/
        required igdb_id: int64;
    }
    type GameMode {
        required name: str;
    }
   
    abstract type HasCreatedAt {
        required created_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        }
    }

    type Campaign extending HasCreatedAt, HasBillingAccount {
        required title: str;
        description: str;
        required slug: str;
        tagline: str;
        goal: int64;
        required game: Game;
        game_mode: GameMode;
        required creator: auth::User;
        required multi participants: auth::User;
        required closed: bool {
            default := false;
        }
        required credits_pledged: int64 {
            default := 0;
        }
        required upvote_count: int64 {
            default := 0;
        }
        overloaded billing_account: BillingAccount {
            rewrite insert using (insert BillingAccount{
                name := __subject__.title
            })
        }
    }

    type Pledge extending HasCreatedAt {
        required campaign: Campaign;
        required user: auth::User;
        required num_credits: int64 {
            constraint min_value(1);
        }
        required credit_transaction: CreditTransaction;
    }

    type Payout extending HasCreatedAt {
        required campaign: Campaign;
        required user: auth::User;
        required num_credits: int64;
        required credit_transaction: CreditTransaction;
    }

    type UserUpvote extending HasCreatedAt {
        required user: auth::User;
        required campaign: Campaign;
        constraint exclusive on ((.user, .campaign));

        trigger add_upvote after insert for each do (
            update Campaign filter .id = __new__.campaign.id
            set {
                upvote_count := .upvote_count + 1
            }
        );
        trigger remove_upvote after delete for each do (
            update Campaign filter .id = __old__.campaign.id
            set {
                upvote_count := .upvote_count - 1
            }
        );
    }
    Scalar type SpecialAccount extending enum<StripeCheckout>; 
    
    type BillingAccount {
        required name: str;
        special_account_type: SpecialAccount;
        required balance: int64 {
            default := 0
        }
        required can_go_negative: bool {
            default := false;
        }
         constraint expression on (
            .can_go_negative or .balance >= 0
        );
    }

    type CreditTransaction extending HasCreatedAt{
        notes: str;
        required multi postings: Posting {
            constraint exclusive;
        }
    }

    type Posting {
        required amount: int64;
        required account: BillingAccount;
        single link credit_transaction := .<postings[is CreditTransaction];
    }

    abstract type HasBillingAccount {
        required billing_account: BillingAccount {
            default := (insert BillingAccount {
                name := "Billing Account"
            });
        }
    }

    type CreditPurchase extending HasCreatedAt{
        required user: auth::User;
        required fiat_paid: int64;
        required num_credits: int64;
        required credit_transaction: CreditTransaction;
    }
}
