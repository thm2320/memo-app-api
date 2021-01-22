import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Person {
  @Field(() => Int)
  id: number;

  @Field()
  displayName: string;

  @Field()
  creationDate: Date

  @Field()
  updateDate: Date
}
