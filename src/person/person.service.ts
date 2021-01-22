import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/person.dto';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class PersonService {
  constructor(
    private readonly neo4jService: Neo4jService
  ) { }

  constructPersonDate(personRec) {
    return {
      ...personRec.properties,
      id: personRec.identity.toString(),
      creationDate: new Date(personRec.properties.creationDate),
      updateDate: new Date(personRec.properties.updateDate)
    }
  }

  async create(createPersonInput: CreatePersonInput) {
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
      data: this.constructPersonDate(person)
    };
  }

  async findAll() {
    const query = `
      MATCH (n:Person) 
      RETURN n 
    `
    const res = await this.neo4jService.read(query)
    const persons = res.records.map(p => {
      const personRec = p.get('n')
      return this.constructPersonDate(personRec)
    })
    return persons
  }

  async isPersonExist(id: string) {
    const matchQuery = `
      match (p:Person) 
      where id(p) = ${id} 
      return count(p) as count
    `
    const checkRes = await this.neo4jService.read(matchQuery)
    return (checkRes.records[0].get('count') > 0)
  }
}
