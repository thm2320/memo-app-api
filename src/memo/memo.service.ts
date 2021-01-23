import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { PersonService } from 'src/person/person.service';
import { CreateMemoInput, LinkPersonInput, ListMemoInput } from './dto/memo.dto';

@Injectable()
export class MemoService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly personService: PersonService
  ) { }

  async create(createMemoInput: CreateMemoInput) {
    const isExist = await this.personService.isPersonExist(createMemoInput.personId);
    if (!isExist) {
      return {
        success: false,
        errorMessage: `Owner #${createMemoInput.personId} does not exist`
      };
    }

    const createQuery = `
      CREATE (memo:Memo {
        title:'${createMemoInput.title}',
        content:'${createMemoInput.content}',
        creationDate: datetime(),
        updateDate: datetime(),
        personId: ${createMemoInput.personId}
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
        personId:${personId}
      })
      RETURN memo
      SKIP ${offset ? offset : 0}
      LIMIT ${limit ? limit : 25}      
    `
    const res = await this.neo4jService.read(query)

    const memos = res.records.map(mRec => {
      const m = mRec.get('memo')
      return {
        ...m.properties,
        id: m.identity.toString(),
        creationDate: new Date(m.properties.creationDate),
        updateDate: new Date(m.properties.updateDate)
      }
    })
    return memos
  }

  async linkPerson(linkPersonInput: LinkPersonInput) {
    const { memoId, personId } = linkPersonInput;
    const query = `
      MATCH (p:Person), (m:Memo)
      WHERE id(p)=${personId} and id(m)=${memoId}
      and m.personId <> ${personId} 
      MERGE (m)-[r:LINKED_TO ]->(p)
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
      MATCH (memo:Memo)
      WHERE id(memo) = ${id}
      OPTIONAL MATCH (memo)-->(person:Person)
      RETURN memo {
        .*, 
        id:id(memo),
        persons: collect(person{.*, id:id(person)})
      }
    `
    const res = await this.neo4jService.read(query)
    console.log(res.records)
    const memo = res.records[0]?.get('memo')
    console.log(memo)
    if (memo) {
      return {
        ...memo,
        persons: memo.persons.map(p => {
          return {
            ...p,
            id: p.id.toString(),
            creationDate: new Date(p.creationDate),
            updateDate: new Date(p.updateDate)
          }
        }),
        id: memo.id.toString(),
        creationDate: new Date(memo.creationDate),
        updateDate: new Date(memo.updateDate)
      }
    } else {
      return null
    }
  }


  /* findOne(id: number) {
    return `This action returns a #${id} memo`;
  }

  update(id: number, updateMemoInput: UpdateMemoInput) {
    return `This action updates a #${id} memo`;
  }

  remove(id: number) {
    return `This action removes a #${id} memo`;
  } */
}
