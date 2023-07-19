CREATE MIGRATION m1ukmouijrudgvfruhklhbpi6xksqy657ce3glrvucgmvxcapnhbuq
    ONTO m1b54dwcerosrertdbhqoln7eonuvn2b66vvrx66gce2taeslrwnxa
{
  CREATE SCALAR TYPE default::currency EXTENDING std::decimal {
      CREATE CONSTRAINT std::expression ON ((((__subject__ * 100n) - math::floor((__subject__ * 100n))) = 0));
  };
  ALTER TYPE default::Campaign {
      ALTER PROPERTY goal {
          SET TYPE default::currency;
      };
  };
  ALTER TYPE default::Payout {
      ALTER PROPERTY amount {
          SET TYPE default::currency;
      };
  };
  ALTER TYPE default::Pledge {
      ALTER PROPERTY amount {
          SET TYPE default::currency;
      };
  };
};
