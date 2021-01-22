import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { CreateMemoInput } from './dto/create-memo.input';

@Injectable()
export class MemoService {
  constructor(
    private readonly neo4jService: Neo4jService
  ) { }

  async create(createMemoInput: CreateMemoInput) {
    const createQuery = `
      CREATE (memo:Memo {
        title:'${createMemoInput.title}',
        content:'${createMemoInput.content}',
        creationDate: datetime(),
        updateDate: datetime()
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

  findAll() {
    return `This action returns all memo`;
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
