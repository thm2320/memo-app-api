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
export class ListMemoInput {
  @Field()
  personId: string;

  @Field(type => Int, { nullable: true })
  limit?: number;

  @Field(type => Int, { nullable: true })
  offset?: number;
}

