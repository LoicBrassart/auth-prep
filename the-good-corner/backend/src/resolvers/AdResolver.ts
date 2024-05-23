import { Category } from "../entities/category";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Ad } from "../entities/ad";
import { Tag } from "../entities/tag";
import { User } from "../entities/user";
import { commonElts } from "../helpers/array";

@InputType()
class NewAdInput implements Partial<Ad> {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field(() => String, { nullable: true })
  imgUrl?: string | undefined;

  @Field()
  ville: string;

  @Field(() => ID)
  category: Category;

  @Field(() => [ID])
  tags?: Tag[] | undefined;
}

@Resolver(Ad)
class AdResolver {
  @Query(() => [Ad])
  async getAllAds() {
    const ads = await Ad.find({ relations: { category: true, owner: true } });
    return ads;
  }

  @Query(() => Ad)
  async getAdById(@Arg("adId") adId: string) {
    const ad = await Ad.findOneByOrFail({ id: Number.parseInt(adId) });
    return ad;
  }

  @Authorized("USER")
  @Mutation(() => Ad)
  async createNewAd(@Arg("data") newAdData: NewAdInput, @Ctx() ctx: any) {
    console.log("createNewAd:context", ctx);

    const owner = await User.findOneByOrFail({ id: ctx.id });

    const resultFromSave = await Ad.save({ ...newAdData, owner });
    const resultForApi = await Ad.find({
      relations: { category: true },
      where: { id: resultFromSave.id },
    });
    return resultForApi[0];
  }

  @Authorized("USER, MODERATOR")
  @Mutation(() => Ad)
  async deleteAd(@Arg("adId") adId: number, @Ctx() ctx: any) {
    const owner = await User.findOneByOrFail({ id: ctx.id });
    const ad = await Ad.findOneByOrFail({ id: adId });
    if (
      owner.id !== ad.owner.id &&
      !commonElts(ctx.roles, ["MODERATOR", "ADMIN"]).length
    ) {
      return new Error("Not authorized");
    }

    ad.remove();
    return "Deleted ad";
  }
}

export default AdResolver;
