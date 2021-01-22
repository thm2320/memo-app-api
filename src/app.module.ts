import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j'
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { MemoModule } from './memo/memo.module';


@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
    }),
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'graph'
    }),
    MemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
