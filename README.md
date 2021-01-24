
## Instruction to start at local
1. prepare an empty neo4j database
2. run cmd `npm install`
3. copy the .docker.env to .env and update the database config accordingly
4. run cmd `npm start`
5. open http://localhost:3000/graphql/ . It should show graphql playground. You can test the api there

## Test
1. run cmd `npm run test`

## Run with Docker
1. run cmd `docker-compose up`
2. It also contain a neo4j database, you may need to open the neo4j browser at http://localhost:7474/browser/ to initalize the database
3. Rerun the cmd in step 1 if the app failed to start 

## UI
Please check https://github.com/thm2320/memo-app-ui
