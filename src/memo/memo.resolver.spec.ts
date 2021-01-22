import { Test, TestingModule } from '@nestjs/testing';
import { MemoResolver } from './memo.resolver';
import { MemoService } from './memo.service';

describe('MemoResolver', () => {
  let resolver: MemoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoResolver, MemoService],
    }).compile();

    resolver = module.get<MemoResolver>(MemoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
