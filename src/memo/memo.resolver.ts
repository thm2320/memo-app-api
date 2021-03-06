import { HttpStatus, HttpException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MemoService } from './memo.service';
import { Memo, MemoInfo, MemoTitle, MemoLink } from './entities/memo.entity';
import { CreateMemoInput, ListMemoInput, LinkPersonInput, UpdateMemoInput, UnlinkPersonInput } from './dto/memo.dto';

@Resolver(() => Memo)
export class MemoResolver {
  constructor(private readonly memoService: MemoService) { }

  @Mutation(() => MemoInfo)
  async createMemo(@Args('createMemoInput') createMemoInput: CreateMemoInput) {
    const res = await this.memoService.create(createMemoInput);
    if (res.success) {
      return res.data
    } else {
      throw new HttpException(res.errorMessage, HttpStatus.CONFLICT);
    }
  }

  @Mutation(() => MemoInfo)
  async updateMemo(@Args('updateMemoInput') updateMemoInput: UpdateMemoInput) {
    const res = await this.memoService.update(updateMemoInput);
    if (res.success) {
      return res.data
    } else {
      throw new HttpException(res.errorMessage, HttpStatus.CONFLICT);
    }
  }

  @Query(() => [MemoTitle], { name: 'listMemo' })
  findAll(@Args('listMemoInput') listMemoInput: ListMemoInput) {
    return this.memoService.findByPersonId(listMemoInput);
  }

  @Mutation(() => MemoLink)
  async linkPerson(@Args('linkPersonInput') linkPersonInput: LinkPersonInput) {
    const res = await this.memoService.linkPerson(linkPersonInput);
    if (res.success) {
      return res.data
    } else {
      throw new HttpException(res.errorMessage, HttpStatus.CONFLICT);
    }
  }

  @Mutation(() => MemoLink)
  async unlinkPerson(@Args('unlinkPersonInput') unlinkPersonInput: UnlinkPersonInput) {
    const res = await this.memoService.unlinkPerson(unlinkPersonInput);
    if (res.success) {
      return res.data
    } else {
      throw new HttpException(res.errorMessage, HttpStatus.CONFLICT);
    }
  }

  @Query(() => Memo, { name: 'memo', nullable: true })
  async findOne(@Args('id') id: string) {
    const res = await this.memoService.findOne(id)
    return res
  }
}
