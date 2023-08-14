CREATE MIGRATION m1p25dlwonrxy63hlkqz7w2hjeafod3mwwqzjwmn44elpcrp63fu5a
    ONTO m1ukmouijrudgvfruhklhbpi6xksqy657ce3glrvucgmvxcapnhbuq
{
  ALTER TYPE default::Campaign {
      DROP PROPERTY ended;
  };
  ALTER TYPE default::Campaign {
      CREATE REQUIRED PROPERTY pledged_captured: default::currency {
          SET default := 0;
      };
  };
  CREATE TYPE default::TentativePledge EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK campaign: default::Campaign;
      CREATE REQUIRED PROPERTY amount: default::currency {
          CREATE CONSTRAINT std::min_value(1);
      };
      CREATE REQUIRED LINK user: auth::User;
  };
  CREATE TYPE default::CapturedPledge EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK tentative_pledge: default::TentativePledge;
      CREATE TRIGGER add_pledged_captured
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Campaign
          FILTER
              (.id = __new__.tentative_pledge.campaign.id)
          SET {
              pledged_captured := (.pledged_captured + __new__.tentative_pledge.amount)
          });
  };
  ALTER TYPE default::Campaign {
      CREATE REQUIRED PROPERTY pledged_tentative: default::currency {
          SET default := 0;
      };
  };
  ALTER TYPE default::TentativePledge {
      CREATE TRIGGER add_pledged_tentative
          AFTER INSERT 
          FOR EACH DO (UPDATE
              default::Campaign
          FILTER
              (.id = __new__.campaign.id)
          SET {
              pledged_tentative := (.pledged_tentative + __new__.amount)
          });
  };
  DROP TYPE default::Pledge;
};
