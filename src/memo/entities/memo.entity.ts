import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Memo {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  creationDate: Date

  @Field()
  updateDate: Date

  @Field()
  personId: string
}
