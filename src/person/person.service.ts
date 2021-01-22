import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';

@Injectable()
export class PersonService {
  create(createPersonInput: CreatePersonInput) {
    return {
      id: 1,
      displayName: createPersonInput.displayName,
      creationDate: new Date(),
      updateDate: new Date()
    };
  }

  findAll() {
    return [{
      id: 1,
      displayName: 'Tester',
      creationDate: new Date(),
      updateDate: new Date()
    }];
  }
}
