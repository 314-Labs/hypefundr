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
    scalar type gameModeName extending enum<Singleplayer, Co-Op, PvP>;
    type GameMode {
        required name: gameModeName
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
        game: Game;
        game_mode: GameMode;
        required creator: auth::User;
        required multi participants: auth::User;
        required closed: bool {
            default := false;
        }
        required pledged_tentative: currency {
            default := 0;
        }
        required pledged_captured: currency {
            default := 0;
        }
    }

    type TentativePledge extending HasCreatedAt {
        required campaign: Campaign;
        required user: auth::User;
        required amount: currency {
            constraint min_value(1);
        }

        trigger add_pledged_tentative after insert for each do (
            update Campaign filter .id = __new__.campaign.id
            set {
                pledged_tentative := .pledged_tentative + __new__.amount
            }
        );
    }

    type CapturedPledge extending HasCreatedAt {
        # The original tentative pledge that we captured
        required tentative_pledge: TentativePledge;

        trigger add_pledged_captured after insert for each do (
        update Campaign filter .id = __new__.tentative_pledge.campaign.id
            set {
                pledged_captured := .pledged_captured + __new__.tentative_pledge.amount
            }
        );
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
