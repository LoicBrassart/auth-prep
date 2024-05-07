import * as argon2 from "argon2";
import { User } from "../entities/user";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";

@InputType()
class NewUserInput implements Partial<User> {
  @Field()
  mail: string;

  @Field()
  password: string;
}

@Resolver()
class UserResolver {
  @Mutation(() => String)
  async createUser(@Arg("data") userData: NewUserInput) {
    console.log("new user data", userData);
    const hashedPassword = await argon2.hash(userData.password);
    await User.save({
      mail: userData.mail,
      hashedPassword,
    });
    return "User created";
  }
}

export default UserResolver;
