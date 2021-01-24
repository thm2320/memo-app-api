import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j'
import { GraphQLModule } from '@nestjs/graphql';
import { MemoModule } from './memo/memo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          scheme: configService.get('NEO4J_SCHEME'),
          host: configService.get('NEO4J_HOST'),
          port: +configService.get('NEO4J_PORT'),
          username: configService.get('NEO4J_USERNAME'),
          password: configService.get('NEO4J_PASSWORD')
        }
        console.log(dbConfig)
        return dbConfig
      },
      inject: [ConfigService],

    }),
    MemoModule,
  ]
})
export class AppModule { }
