CREATE MIGRATION m12nxohdblh3vx44hrllqzoqxz3wui6e5kjbwzrlwacjvsrffx7pya
    ONTO initial
{
  CREATE MODULE auth IF NOT EXISTS;
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE auth::Account {
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE PROPERTY access_token -> std::str;
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY expires_at -> std::int64;
      CREATE PROPERTY id_token -> std::str;
      CREATE PROPERTY refresh_token -> std::str;
      CREATE PROPERTY scope -> std::str;
      CREATE PROPERTY session_state -> std::str;
      CREATE PROPERTY token_type -> std::str;
      CREATE REQUIRED PROPERTY type -> std::str;
  };
  CREATE TYPE auth::User {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY emailVerified -> std::datetime;
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
  };
  ALTER TYPE auth::Account {
      CREATE REQUIRED LINK user -> auth::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (.user.id);
  };
  ALTER TYPE auth::User {
      CREATE MULTI LINK accounts := (.<user[IS auth::Account]);
  };
  CREATE TYPE auth::Session {
      CREATE REQUIRED LINK user -> auth::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (.user.id);
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires -> std::datetime;
      CREATE REQUIRED PROPERTY sessionToken -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE auth::User {
      CREATE MULTI LINK sessions := (.<user[IS auth::Session]);
  };
  CREATE TYPE default::Game {
      CREATE REQUIRED PROPERTY igdb_id -> std::int64;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::GameMode {
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE ABSTRACT TYPE default::HasCreatedAt {
      CREATE REQUIRED PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  CREATE TYPE default::Campaign EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK creator -> auth::User;
      CREATE MULTI LINK liked_by -> auth::User;
      CREATE REQUIRED MULTI LINK participants -> auth::User;
      CREATE LINK game -> default::Game;
      CREATE LINK game_mode -> default::GameMode;
      CREATE PROPERTY description -> std::str;
      CREATE PROPERTY ended -> std::bool;
      CREATE PROPERTY goal -> std::decimal;
      CREATE REQUIRED PROPERTY slug -> std::str;
      CREATE PROPERTY tagline -> std::str;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::Payout EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK user -> auth::User;
      CREATE REQUIRED LINK campaign -> default::Campaign;
      CREATE REQUIRED PROPERTY amount -> std::decimal;
  };
  CREATE TYPE default::Pledge EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK user -> auth::User;
      CREATE REQUIRED LINK campaign -> default::Campaign;
      CREATE REQUIRED PROPERTY amount -> std::decimal {
          CREATE CONSTRAINT std::min_value(1);
      };
  };
  CREATE TYPE auth::VerificationToken {
      CREATE REQUIRED PROPERTY identifier -> std::str;
      CREATE REQUIRED PROPERTY token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.identifier, .token));
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires -> std::datetime;
  };
};
