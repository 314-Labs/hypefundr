CREATE MIGRATION m13irjcupp2bxgjzt2xkg4pil6247uouifwvwygmlg6n4uh4cqqtoq
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Account {
      CREATE REQUIRED PROPERTY provider: std::str;
      CREATE REQUIRED PROPERTY providerAccountId: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE PROPERTY access_token: std::str;
      CREATE PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY expires_at: std::int64;
      CREATE PROPERTY id_token: std::str;
      CREATE PROPERTY refresh_token: std::str;
      CREATE PROPERTY scope: std::str;
      CREATE PROPERTY session_state: std::str;
      CREATE PROPERTY token_type: std::str;
      CREATE REQUIRED PROPERTY type: std::str;
  };
  CREATE SCALAR TYPE default::SpecialAccount EXTENDING enum<StripeCheckout, StripeConnect>;
  CREATE TYPE default::BillingAccount {
      CREATE REQUIRED PROPERTY balance: std::int64 {
          SET default := 0;
      };
      CREATE REQUIRED PROPERTY can_go_negative: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE CONSTRAINT std::expression ON ((.can_go_negative OR (.balance >= 0)));
      CREATE PROPERTY special_account_type: default::SpecialAccount {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE ABSTRACT TYPE default::HasBillingAccount {
      CREATE REQUIRED LINK billing_account: default::BillingAccount {
          SET default := (INSERT
              default::BillingAccount
              {
                  name := 'Billing Account'
              });
      };
  };
  CREATE TYPE default::User EXTENDING default::HasBillingAccount {
      ALTER LINK billing_account {
          SET OWNED;
          SET TYPE default::BillingAccount;
      };
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER LINK billing_account {
          CREATE REWRITE
              INSERT 
              USING (INSERT
                  default::BillingAccount
                  {
                      name := __subject__.email
                  });
      };
      CREATE PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY emailVerified: std::datetime;
      CREATE PROPERTY image: std::str;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY stripe_connected_account: std::str;
  };
  ALTER TYPE default::Account {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (.user.id);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
  };
  CREATE TYPE default::Game {
      CREATE REQUIRED PROPERTY igdb_id: std::int64;
      CREATE REQUIRED PROPERTY poster_image: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::GameMode {
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE ABSTRACT TYPE default::HasCreatedAt {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  CREATE TYPE default::Campaign EXTENDING default::HasCreatedAt, default::HasBillingAccount {
      ALTER LINK billing_account {
          SET OWNED;
          SET TYPE default::BillingAccount;
      };
      CREATE REQUIRED PROPERTY title: std::str;
      ALTER LINK billing_account {
          CREATE REWRITE
              INSERT 
              USING (INSERT
                  default::BillingAccount
                  {
                      name := __subject__.title
                  });
      };
      CREATE REQUIRED LINK creator: default::User;
      CREATE REQUIRED LINK game: default::Game;
      CREATE LINK game_mode: default::GameMode;
      CREATE REQUIRED MULTI LINK participants: default::User;
      CREATE REQUIRED PROPERTY closed: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY credits_pledged: std::int64 {
          SET default := 0;
      };
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY goal: std::int64;
      CREATE REQUIRED PROPERTY slug: std::str;
      CREATE PROPERTY tagline: std::str;
      CREATE REQUIRED PROPERTY upvote_count: std::int64 {
          SET default := 0;
      };
  };
  CREATE TYPE default::Posting {
      CREATE REQUIRED LINK account: default::BillingAccount;
      CREATE REQUIRED PROPERTY amount: std::int64;
  };
  CREATE TYPE default::UserUpvote EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK campaign: default::Campaign;
      CREATE TRIGGER add_upvote
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Campaign
          FILTER
              (.id = __new__.campaign.id)
          SET {
              upvote_count := (.upvote_count + 1)
          });
      CREATE TRIGGER remove_upvote
          AFTER DELETE 
          FOR EACH DO (UPDATE
              default::Campaign
          FILTER
              (.id = __old__.campaign.id)
          SET {
              upvote_count := (.upvote_count - 1)
          });
      CREATE REQUIRED LINK user: default::User;
      CREATE CONSTRAINT std::exclusive ON ((.user, .campaign));
  };
  CREATE TYPE default::CreditTransaction EXTENDING default::HasCreatedAt {
      CREATE REQUIRED MULTI LINK postings: default::Posting {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY notes: std::str;
  };
  CREATE TYPE default::Payout EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK campaign: default::Campaign;
      CREATE REQUIRED LINK credit_transaction: default::CreditTransaction;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY num_credits: std::int64;
  };
  CREATE TYPE default::Pledge EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK campaign: default::Campaign;
      CREATE REQUIRED LINK credit_transaction: default::CreditTransaction;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY num_credits: std::int64 {
          CREATE CONSTRAINT std::min_value(1);
      };
  };
  CREATE TYPE default::CreditPurchase EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK credit_transaction: default::CreditTransaction;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY fiat_paid: std::int64;
      CREATE REQUIRED PROPERTY num_credits: std::int64;
  };
  ALTER TYPE default::Posting {
      CREATE SINGLE LINK credit_transaction := (.<postings[IS default::CreditTransaction]);
  };
  CREATE TYPE default::CreditWithdrawal EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK credit_transaction: default::CreditTransaction;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY fiat_earned: std::int64;
      CREATE REQUIRED PROPERTY num_credits: std::int64;
  };
  CREATE TYPE default::Session {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (.user.id);
      CREATE PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires: std::datetime;
      CREATE REQUIRED PROPERTY sessionToken: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK sessions := (.<user[IS default::Session]);
  };
  CREATE TYPE default::VerificationToken {
      CREATE REQUIRED PROPERTY identifier: std::str;
      CREATE REQUIRED PROPERTY token: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.identifier, .token));
      CREATE PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires: std::datetime;
  };
};
