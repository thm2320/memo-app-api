import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jModule } from 'nest-neo4j';
import { PersonModule } from '../person/person.module';
import { CreateMemoInput, LinkPersonInput, ListMemoInput } from './dto/memo.dto';
import { Memo, MemoInfo, MemoTitle } from './entities/memo.entity';
import { MemoResolver } from './memo.resolver';
import { MemoService } from './memo.service';

jest.mock('neo4j-driver/lib/driver')

describe('MemoResolver', () => {
  let memoResolver: MemoResolver;
  let memoService: MemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Neo4jModule.forRoot({ //some dummmy config 
          scheme: 'neo4j',
          host: 'localhost',
          port: 7687,
          username: 'neo4j',
          password: 'graph'
        }),
        PersonModule
      ],

      providers: [MemoResolver, MemoService],
    }).compile();

    memoResolver = module.get<MemoResolver>(MemoResolver);
    memoService = module.get<MemoService>(MemoService);
  });

  describe('createMemo', () => {
    it('should return the memo just created', async () => {
      const createMemoInput: CreateMemoInput = {
        title: 'Title 1',
        content: 'Content 1',
        personId: '1'
      }

      const memo: MemoInfo = {
        ...createMemoInput,
        id: '0',
        creationDate: new Date(),
        updateDate: new Date()
      }

      jest.spyOn(memoService, 'create').mockResolvedValue({
        success: true,
        data: memo
      })

      return expect(await memoResolver.createMemo(createMemoInput)).toBe(memo)
    });

    it('should throw exception if service return not success to create memo', async () => {
      const createMemoInput: CreateMemoInput = {
        title: 'Title 1',
        content: 'Content 1',
        personId: '1'
      }

      jest.spyOn(memoService, 'create').mockResolvedValue({
        success: false,
        errorMessage: 'Some errors'
      })

      try {
        await memoResolver.createMemo(createMemoInput)
      } catch (e) {
        expect(e.response).toMatch('Some errors')
      }
    })

  });

  describe('findAll', () => {
    it('should return all id and title of memos belongs to the person', async () => {
      const listMemoInput: ListMemoInput = {
        personId: '0'
      }

      const memos = [{
        id: '0',
        title: 'Title 1',
        content: 'Content 1',
        creationDate: new Date(),
        updateDate: new Date()
      }, {
        id: '1',
        title: 'Title 2',
        content: 'Content 2',
        creationDate: new Date(),
        updateDate: new Date()
      }]

      jest.spyOn(memoService, 'findByPersonId').mockResolvedValue(memos)

      const res = await memoResolver.findAll(listMemoInput)
      expect(res).toBe(memos)
    });
  });

  describe('linkPerson', () => {
    it('should return the linkId from the relationship just created', async () => {
      const linkPersonInput: LinkPersonInput = {
        memoId: '0',
        personId: '0'
      }

      jest.spyOn(memoService, 'linkPerson').mockResolvedValue({
        success: true,
        data: {
          linkId: '0'
        }
      })

      const res = await memoResolver.linkPerson(linkPersonInput)
      expect(res).toHaveProperty('linkId', '0')
    });

    it('should throw exception if service return not success to link person', async () => {
      const linkPersonInput: LinkPersonInput = {
        memoId: '0',
        personId: '0'
      }

      jest.spyOn(memoService, 'linkPerson').mockResolvedValue({
        success: false,
        errorMessage: 'Some Errors'
      })

      try {
        await memoResolver.linkPerson(linkPersonInput)
      } catch (e) {
        expect(e.response).toMatch('Some Errors')
      }
    });
  });

  describe('findOne', () => {
    it('should return memo and its linked persons', async () => {
      const id = '0';

      const result: Memo = {
        id: '0',
        title: 'Title 1',
        content: 'Content 1',
        creationDate: new Date(),
        updateDate: new Date(),
        personId: '0',
        persons: [{
          id: '0',
          displayName: 'Person 1',
          creationDate: new Date(),
          updateDate: new Date()
        }]
      }

      jest.spyOn(memoService, 'findOne').mockResolvedValue(result)

      const res = await memoResolver.findOne(id)
      expect(res).toBe(result)
    });

    it('should return null if not found', async () => {
      const id = '0';

      const result = null;

      jest.spyOn(memoService, 'findOne').mockResolvedValue(result)

      const res = await memoResolver.findOne(id)
      expect(res).toBe(result)
    });
  });
});
