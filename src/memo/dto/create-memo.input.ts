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
