import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j';
import { mockResult, mockNode } from 'nest-neo4j/dist/test';
import { DateTime } from 'neo4j-driver/lib/temporal-types.js';

jest.mock('neo4j-driver/lib/driver')

describe('PersonService', () => {
  let personService: PersonService;
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
        })
      ],
      providers: [PersonService],
    }).compile();

    personService = module.get<PersonService>(PersonService);
    neo4jService = module.get<Neo4jService>(Neo4jService);
  });

  describe('create', () => {
    const data = {
      id: '1',
      displayName: 'Person 1',
      creationDate: new Date(),
      updateDate: new Date()
    }

    it('return a success result with person data if create successfully', async () => {
      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult([
            {
              count: 0
            },
          ])
        )

      jest.spyOn(neo4jService, 'write')
        .mockResolvedValue(
          mockResult([
            {
              person: mockNode('Person', {
                ...data,
                creationDate: DateTime.fromStandardDate(data.creationDate),
                updateDate: DateTime.fromStandardDate(data.updateDate)
              })
            },
          ])
        )
      const res = await personService.create(data)
      expect(res.success).toEqual(true)
      expect(res.data).toHaveProperty('id')
      expect(res.data).toHaveProperty('displayName', data.displayName)
      expect(res.data).toHaveProperty('creationDate', data.creationDate)
      expect(res.data).toHaveProperty('updateDate', data.updateDate)
    });

    it('return a fail result with errorMessage if displayName already exists', async () => {
      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult([
            {
              count: 1
            },
          ])
        )

      const res = await personService.create(data)
      expect(res.success).toEqual(false)
      expect(res).toHaveProperty('errorMessage', `Person "${data.displayName}" already exists`)

    });
  })

  describe('findAll', () => {
    const personData = [{
      displayName: 'Person 1',
      creationDate: new Date(),
      updateDate: new Date()
    }, {
      displayName: 'Person 2',
      creationDate: new Date(),
      updateDate: new Date()
    }]

    it('return an array of persons', async () => {


      jest.spyOn(neo4jService, 'read')
        .mockResolvedValue(
          mockResult(
            personData.map(data => {
              return {
                n: mockNode('Person', {
                  ...data,
                  creationDate: DateTime.fromStandardDate(data.creationDate),
                  updateDate: DateTime.fromStandardDate(data.updateDate)
                })
              }
            })
          )
        )
      const res = await personService.findAll();

      expect(res).toHaveLength(2)
      expect(res[0]).toHaveProperty('displayName', personData[0].displayName)
      expect(res[0]).toHaveProperty('creationDate', personData[0].creationDate)
      expect(res[0]).toHaveProperty('updateDate', personData[0].updateDate)
    })


  })
});
