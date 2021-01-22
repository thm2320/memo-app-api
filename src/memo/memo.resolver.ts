import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MemoService } from './memo.service';
import { Memo } from './entities/memo.entity';
import { CreateMemoInput } from './dto/create-memo.input';
import { UpdateMemoInput } from './dto/update-memo.input';

@Resolver(() => Memo)
export class MemoResolver {
  constructor(private readonly memoService: MemoService) { }

  @Mutation(() => Memo)
  async createMemo(@Args('createMemoInput') createMemoInput: CreateMemoInput) {
    const res = await this.memoService.create(createMemoInput);
    if (res.success) {
      return res.data
    }
  }

  @Query(() => [Memo], { name: 'memo' })
  findAll() {
    return this.memoService.findAll();
  }

  /* @Query(() => Memo, { name: 'memo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.memoService.findOne(id);
  }

  @Mutation(() => Memo)
  updateMemo(@Args('updateMemoInput') updateMemoInput: UpdateMemoInput) {
    return this.memoService.update(updateMemoInput.id, updateMemoInput);
  }

  @Mutation(() => Memo)
  removeMemo(@Args('id', { type: () => Int }) id: number) {
    return this.memoService.remove(id);
  } */
}
