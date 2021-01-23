import { ObjectType, Field, PickType, OmitType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';

@ObjectType()
export class Memo {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  creationDate: Date;

  @Field()
  updateDate: Date;

  @Field()
  personId: string;

  @Field(type => [Person])
  persons: Person[];
}

@ObjectType()
export class MemoInfo extends OmitType(Memo, ["persons"]) { }


@ObjectType()
export class MemoTitle extends PickType(Memo, ["id", "title"]) { }

@ObjectType()
export class MemoLink {
  @Field()
  linkId: string;
}
