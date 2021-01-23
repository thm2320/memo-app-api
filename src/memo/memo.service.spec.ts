import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jModule, Neo4jService } from 'nest-neo4j';
import { PersonModule } from '../person/person.module';
import { MemoService } from './memo.service';
import { mockResult, mockNode, } from 'nest-neo4j/dist/test';
import { DateTime } from 'neo4j-driver/lib/temporal-types.js';
import { LinkPersonInput, ListMemoInput } from './dto/memo.dto';

describe('MemoService', () => {
  let memoService: MemoService;
  let neo4jService: Neo4jService;

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
      providers: [MemoService],
    }).compile();

    memoService = module.get<MemoService>(MemoService);
    neo4jService = module.get<Neo4jService>(Neo4jService);
  });

  describe('create', () => {
    const data = {
      title: 'Title 1',
      content: 'Content 1',
      personId: '1',
      creationDate: new Date(),
      updateDate: new Date()
    }

    it('return a success result with memo data if create successfully', async () => {
      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult([
            {
              count: 1
            },
          ])
        )

      jest.spyOn(neo4jService, 'write')
        .mockResolvedValue(
          mockResult([
            {
              memo: mockNode('Memo', {
                ...data,
                creationDate: DateTime.fromStandardDate(data.creationDate),
                updateDate: DateTime.fromStandardDate(data.updateDate)
              })
            },
          ])
        )
      const res = await memoService.create(data)
      expect(res.success).toEqual(true)
      expect(res.data).toHaveProperty('id')
      expect(res.data).toHaveProperty('title', data.title)
      expect(res.data).toHaveProperty('content', data.content)
      expect(res.data).toHaveProperty('personId', data.personId)
    });

    it('return a fail result with errorMessage if owner not exist', async () => {
      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult([
            {
              count: 0
            },
          ])
        )

      const res = await memoService.create(data)
      expect(res.success).toEqual(false)
      expect(res.errorMessage).toBe(`Owner #id"${data.personId}" does not exist`)
    });
  });

  describe('findByPersonId', () => {
    const listMemoInput: ListMemoInput = {
      personId: '1'
    }

    const memoData = [{
      title: 'Title 1',
      content: 'Content 1',
      personId: '1',
      creationDate: new Date(),
      updateDate: new Date()
    }]

    it('return an array of memos', async () => {
      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult(
            memoData.map(data => {
              return {
                memo: mockNode('Memo', {
                  ...data,
                  creationDate: DateTime.fromStandardDate(data.creationDate),
                  updateDate: DateTime.fromStandardDate(data.updateDate)
                })
              }
            })
          )
        )


      const res = await memoService.findByPersonId(listMemoInput)
      expect(res).toHaveLength(1)
      expect(res[0]).toHaveProperty('title', memoData[0].title)
      expect(res[0]).toHaveProperty('content', memoData[0].content)
      expect(res[0]).toHaveProperty('personId', memoData[0].personId)
      expect(res[0]).toHaveProperty('creationDate', memoData[0].creationDate)
      expect(res[0]).toHaveProperty('updateDate', memoData[0].updateDate)
    });
  });

  describe('linkPerson', () => {
    const linkPersonInput: LinkPersonInput = {
      memoId: '1',
      personId: '1'
    }


    it('return a success result with link id if link memo and person successfully', async () => {

      jest.spyOn(neo4jService, 'write')
        .mockResolvedValue(
          mockResult([
            {
              r: mockNode('LINKED_TO', {})
            },
          ])
        )
      const res = await memoService.linkPerson(linkPersonInput)
      expect(res.success).toEqual(true)
      expect(res).toHaveProperty('data')
      expect(res.data).toHaveProperty('linkId')
    });

    it('return a fail result errorMessage if the person is owner', async () => {

      jest.spyOn(neo4jService, 'write')
        .mockResolvedValue(
          mockResult([])
        )
      const res = await memoService.linkPerson(linkPersonInput)
      expect(res.success).toEqual(false)
      expect(res).toHaveProperty('errorMessage', 'Cannot link memo to its owner')
    });
  });

  describe('findOne', () => {

    const id = '0';
    const data = {
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


    it('return memo and its linked persons', async () => {

      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult([
            {
              memo: mockNode('Memo', {
                ...data,
                creationDate: DateTime.fromStandardDate(data.creationDate),
                updateDate: DateTime.fromStandardDate(data.updateDate)
              }),
              persons: data.persons.map(p => {
                const pObj = mockNode('Person', {
                  ...p,
                  creationDate: DateTime.fromStandardDate(p.creationDate),
                  updateDate: DateTime.fromStandardDate(p.updateDate),
                })
                return pObj

              })
            }
          ])
        )
      const res = await memoService.findOne(id)

      expect(res).toHaveProperty('id')
      expect(res).toHaveProperty('title', 'Title 1')
      expect(res).toHaveProperty('content', 'Content 1')
      expect(res).toHaveProperty('creationDate', data.creationDate)
      expect(res).toHaveProperty('updateDate', data.updateDate)
      expect(res).toHaveProperty('persons')
      expect(res.persons).toHaveLength(1)
      expect(res.persons[0]).toHaveProperty('id')
      expect(res.persons[0]).toHaveProperty('displayName', 'Person 1')
    });

    it('return null if no memo found', async () => {

      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult([])
        )
      const res = await memoService.findOne(id)

      expect(res).toBeNull()
    });


  });
});
