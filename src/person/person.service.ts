import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { Neo4jService } from 'nest-neo4j';
import { DateTime } from 'neo4j-driver/lib/temporal-types.js'


@Injectable()
export class PersonService {
  constructor(
    private readonly neo4jService: Neo4jService
  ) { }

  async create(createPersonInput: CreatePersonInput) {
    // console.log(new DateTime(new Date()))
    const matchQuery = `
      MATCH (n:Person{
        displayName: '${createPersonInput.displayName}'
      } ) 
      RETURN count(n) as count
    `
    const checkRes = await this.neo4jService.read(matchQuery)
    if (checkRes.records[0].get('count') > 0) {
      return {
        success: false,
        errorMessage: `Person "${createPersonInput.displayName}" already exists`
      }
    }

    const createQuery = `
      CREATE (person:Person {
        displayName:'${createPersonInput.displayName}',
        creationDate: datetime(),
        updateDate: datetime()
      }) 
      RETURN person
    `
    const res = await this.neo4jService.write(createQuery)
    const person = res.records[0].get('person')
    return {
      success: true,
      data: {
        id: person.identity.toString(),
        ...person.properties
      }
    };
  }

  async findAll() {
    const query = `
      MATCH (n:Person) 
      RETURN n 
    `
    const res = await this.neo4jService.read(query)
    const persons = res.records.map(p => {
      const person = p.get('n')
      return {
        id: person.identity.toString(),
        ...person.properties
      }
    })
    return persons
  }
}
