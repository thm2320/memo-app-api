import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';

@Module({
  providers: [PersonResolver, PersonService],
  exports: [PersonService]
})
export class PersonModule { }
