CREATE MIGRATION m14ungdzgvh6ycncxx3n4nccxawaeijzszwj5yzlq4z4l2xo5neg2a
    ONTO m12nxohdblh3vx44hrllqzoqxz3wui6e5kjbwzrlwacjvsrffx7pya
{
  ALTER TYPE default::Campaign {
      DROP LINK liked_by;
  };
  ALTER TYPE default::Campaign {
      CREATE REQUIRED PROPERTY closed -> std::bool {
          SET default := false;
      };
  };
  CREATE TYPE default::UserLike EXTENDING default::HasCreatedAt {
      CREATE REQUIRED LINK campaign -> default::Campaign;
      CREATE REQUIRED LINK user -> auth::User;
  };
};
