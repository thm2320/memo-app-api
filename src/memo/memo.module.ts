import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoResolver } from './memo.resolver';

@Module({
  providers: [MemoResolver, MemoService]
})
export class MemoModule {}
