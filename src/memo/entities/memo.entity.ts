import { ObjectType, Field, PickType } from '@nestjs/graphql';

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

@ObjectType()
export class MemoTitle extends PickType(Memo, ["id", "title"]) { }
