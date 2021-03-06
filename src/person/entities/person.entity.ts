import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Person {
  @Field()
  id: string;

  @Field()
  displayName: string;

  @Field()
  creationDate: Date

  @Field()
  updateDate: Date
}

