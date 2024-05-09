import { Category } from "../entities/category";
import { Ad } from "../entities/ad";
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
import { Tag } from "src/entities/tag";

@InputType()
class NewAdInput implements Partial<Ad> {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  owner: string;

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
    const ads = await Ad.find({ relations: { category: true } });
    return ads;
  }

  @Query(() => Ad)
  async getAdById(@Arg("adId") adId: string) {
    const ad = await Ad.findOneByOrFail({ id: Number.parseInt(adId) });
    return ad;
  }

  @Authorized("ADMIN", "MODERATOR")
  @Mutation(() => Ad)
  async createNewAd(@Arg("data") newAdData: NewAdInput, @Ctx() ctx: any) {
    console.log(ctx.user); //Allows for example to save new content's author
    const resultFromSave = await Ad.save({ ...newAdData });
    const resultForApi = await Ad.find({
      relations: { category: true },
      where: { id: resultFromSave.id },
    });
    return resultForApi[0];
  }
}

export default AdResolver;
