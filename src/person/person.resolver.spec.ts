import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jModule } from 'nest-neo4j';
import { CreatePersonInput } from './dto/person.dto';
import { Person } from './entities/person.entity';
import { PersonResolver } from './person.resolver';
import { PersonService } from './person.service';

jest.mock('neo4j-driver/lib/driver')

describe('PersonResolver', () => {
  let personResolver: PersonResolver;
  let personService: PersonService;

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
      providers: [PersonResolver, PersonService],
    }).compile();

    personResolver = module.get<PersonResolver>(PersonResolver);
    personService = module.get<PersonService>(PersonService);

  });

  describe('findAll', () => {
    it('should return an array of persons', () => {
      const persons: Person[] = [{
        id: '0',
        displayName: 'Person 1',
        creationDate: new Date(),
        updateDate: new Date()
      }, {
        id: '1',
        displayName: 'Person 2',
        creationDate: new Date(),
        updateDate: new Date()
      }]

      jest.spyOn(personService, 'findAll').mockResolvedValue(persons)

      return expect(personResolver.findAll()).resolves.toBe(persons)
    });
  })

  describe('createPerson', () => {
    it('should return the person just created', async () => {
      const createPersonInput: CreatePersonInput = {
        displayName: 'Person 1'
      }

      const person: Person = {
        id: '0',
        displayName: createPersonInput.displayName,
        creationDate: new Date(),
        updateDate: new Date()
      }

      jest.spyOn(personService, 'create').mockResolvedValue({
        success: true,
        data: person
      })

      return expect(await personResolver.createPerson(createPersonInput)).toBe(person)
    });

    it('should throw exception if service return not success to create person', async () => {
      const createPersonInput: CreatePersonInput = {
        displayName: 'Person 1'
      }

      const person: Person = {
        id: '0',
        displayName: createPersonInput.displayName,
        creationDate: new Date(),
        updateDate: new Date()
      }

      jest.spyOn(personService, 'create').mockResolvedValue({
        success: false,
        errorMessage: 'Some errors'
      })

      try {
        await personResolver.createPerson(createPersonInput)
      } catch (e) {
        expect(e.response).toMatch('Some errors')
      }

    });

  })

});
