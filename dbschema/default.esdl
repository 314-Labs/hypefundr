module default {
    scalar type currency extending decimal {
        # currency values can have at most 2 decimal places
        constraint expression on (__subject__ * 100n - math::floor(__subject__ * 100n) = 0);
    }

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

    type Campaign extending HasCreatedAt {
        required title: str;
        description: str;
        required slug: str;
        tagline: str;
        goal: currency;
        ended: bool;
        game: Game;
        game_mode: GameMode;
        required creator: auth::User;
        required participants: auth::User;
        required closed: bool {
            default := false;
        }
    }

    type Pledge extending HasCreatedAt {
        required campaign: Campaign;
        required user: auth::User;
        required amount: currency {
            constraint min_value(1);
        }
    }

    type Payout extending HasCreatedAt {
        required campaign: Campaign;
        required user: auth::User;
        required amount: currency;
    }

    type UserLike extending HasCreatedAt {
        required user: auth::User;
        required campaign: Campaign;
        constraint exclusive on ((.user, .campaign));
    }
}
