import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ad } from "./ad";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  mail: string;

  @Column()
  hashedPassword: string;

  @Field()
  @Column()
  roles: string;

  @Field(() => [Ad])
  @OneToMany(() => Ad, (ad) => ad.owner)
  ads: Ad[];
}
