module default {
    type Game {
        required property title -> str;
        required property igdb_id -> int64;
    }

    type GameMode {
        required property name -> str;
    }
   
    abstract type HasCreatedAt {
        required property created_at -> datetime {
            readonly := true;
            default := datetime_of_statement();
        }
    }

    type Campaign extending HasCreatedAt {
        required property title -> str;
        property description -> str;
        required property slug -> str;
        property tagline-> str;
        property goal-> decimal;
        property ended-> bool;
        link game -> Game;
        link game_mode -> GameMode;
        required link creator -> auth::User;
        required multi link participants -> auth::User;
        required property closed -> bool {
            default := false;
        }
    }

    type Pledge extending HasCreatedAt {
        required link campaign -> Campaign;
        required link user -> auth::User;
        required property amount -> decimal {
            constraint min_value(1);
        }
    }

    type Payout extending HasCreatedAt {
        required link campaign -> Campaign;
        required link user -> auth::User;
        required property amount -> decimal;
    }

    type UserLike extending HasCreatedAt {
        required link user -> auth::User;
        required link campaign -> Campaign;
        constraint exclusive on ((.user, .campaign));
    }
}
