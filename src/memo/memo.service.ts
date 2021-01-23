import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { PersonService } from '../person/person.service';
import { CreateMemoInput, LinkPersonInput, ListMemoInput } from './dto/memo.dto';

@Injectable()
export class MemoService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly personService: PersonService
  ) { }

  toJson(memoNode) {
    return {
      ...memoNode.properties,
      creationDate: new Date(memoNode.properties.creationDate),
      updateDate: new Date(memoNode.properties.updateDate)
    }
  }

  async create(createMemoInput: CreateMemoInput) {
    const isExist = await this.personService.isPersonExist(createMemoInput.personId);
    if (!isExist) {
      return {
        success: false,
        errorMessage: `Owner #id"${createMemoInput.personId}" does not exist`
      };
    }

    const createQuery = `
      CREATE (memo:Memo {
        id: randomUUID(),
        title:'${createMemoInput.title}',
        content:'${createMemoInput.content}',
        creationDate: datetime(),
        updateDate: datetime(),
        personId: '${createMemoInput.personId}'
      }) 
      RETURN memo
    `
    const res = await this.neo4jService.write(createQuery)
    const memo = res.records[0].get('memo')
    return {
      success: true,
      data: {
        id: memo.identity.toString(),
        ...memo.properties
      }
    };
  }

  async findByPersonId(listMemoInput: ListMemoInput) {
    const { personId, offset, limit } = listMemoInput;

    const query = `
      MATCH (memo:Memo {
        personId:'${personId}'
      })
      RETURN memo
      SKIP ${offset ? offset : 0}
      LIMIT ${limit ? limit : 25}      
    `
    const res = await this.neo4jService.read(query)
    const memos = res.records.map(mRec => {
      const m = mRec.get('memo')
      return this.toJson(m)
    })
    return memos
  }

  async linkPerson(linkPersonInput: LinkPersonInput) {
    const { memoId, personId } = linkPersonInput;
    const query = `
      MATCH (p:Person), (m:Memo)
      WHERE p.id='${personId}' and m.id='${memoId}'
      and m.personId <> '${personId}'
      MERGE (m)-[r:LINKED_TO ]->(p)
      SET m.updateDate = datetime()
      RETURN r 
    `

    const res = await this.neo4jService.write(query)
    const relationship = res.records[0]?.get('r')
    if (relationship) {
      return {
        success: true,
        data: {
          linkId: relationship.identity.toString()
        }
      };
    } else {
      return {
        success: false,
        errorMessage: `Cannot link memo to its owner`
      }
    }
  }

  async findOne(id: string) {

    const query = `          
      MATCH (memo:Memo {id:'${id}'})
      RETURN memo, [ (memo)-->(person:Person) | person ] AS persons 
    `
    const res = await this.neo4jService.read(query)
    const memo = res.records[0]?.get('memo')
    const persons = res.records[0]?.get('persons')
    if (memo) {
      return {
        ...this.toJson(memo),
        persons: persons?.map(p => {

          return this.personService.toJson(p)
        }),
      }
    } else {
      return null
    }
  }

}
