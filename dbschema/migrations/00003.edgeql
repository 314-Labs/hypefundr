CREATE MIGRATION m1b54dwcerosrertdbhqoln7eonuvn2b66vvrx66gce2taeslrwnxa
    ONTO m14ungdzgvh6ycncxx3n4nccxawaeijzszwj5yzlq4z4l2xo5neg2a
{
  ALTER TYPE default::UserLike {
      CREATE CONSTRAINT std::exclusive ON ((.user, .campaign));
  };
};
