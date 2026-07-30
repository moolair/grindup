import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { config } from './config.js';
import { buildContext, type GatewayContext } from './context.js';
import { resolvers } from './resolvers.js';
import { typeDefs } from './schema.js';

const server = new ApolloServer<GatewayContext>({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: config.port, host: config.host },
    context: async ({ req }) => buildContext(req.headers.authorization),
});

console.log(`GraphQL 게이트웨이 실행 중: ${url}`);
console.log(`Firestore 프로젝트: ${config.projectId}`);
console.log('iOS 시뮬레이터 → http://localhost:%d/, Android 에뮬레이터 → http://10.0.2.2:%d/', config.port, config.port);
