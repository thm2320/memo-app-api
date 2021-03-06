import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMemoInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  personId: string;

}

@InputType()
export class UpdateMemoInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;
}


@InputType()
export class ListMemoInput {
  @Field()
  personId: string;

  @Field(type => Int, { nullable: true })
  limit?: number;

  @Field(type => Int, { nullable: true })
  offset?: number;
}

@InputType()
export class LinkPersonInput {
  @Field()
  personId: string;

  @Field()
  memoId: string;
}

@InputType()
export class UnlinkPersonInput {
  @Field()
  personId: string;

  @Field()
  memoId: string;
}


