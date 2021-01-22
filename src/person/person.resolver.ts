import { HttpStatus, HttpException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { CreatePersonInput } from './dto/person.dto';

@Resolver(() => Person)
export class PersonResolver {
  constructor(private readonly personService: PersonService) { }

  @Mutation(() => Person)
  async createPerson(@Args('createPersonInput') createPersonInput: CreatePersonInput) {
    const res = await this.personService.create(createPersonInput);
    if (res.success) {
      return res.data
    } else {
      throw new HttpException(res.errorMessage, HttpStatus.CONFLICT);
    }
  }

  @Query(() => [Person], { name: 'person' })
  findAll() {
    return this.personService.findAll();
  }
}
