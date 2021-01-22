import { CreateMemoInput } from './create-memo.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMemoInput extends PartialType(CreateMemoInput) {
}
