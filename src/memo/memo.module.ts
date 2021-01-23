import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { MemoResolver } from './memo.resolver';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [PersonModule],
  providers: [MemoResolver, MemoService]
})
export class MemoModule { }
