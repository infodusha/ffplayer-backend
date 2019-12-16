import apolloM, * as apolloC from 'apollo-server-express';
const apollo = apolloM || apolloC;
export const gql = apollo.gql;
export const PubSub = apollo.PubSub;
export const ApolloError = apollo.ApolloError;
export const withFilter = apollo.withFilter;
export const SchemaDirectiveVisitor = apollo.SchemaDirectiveVisitor;
export const ApolloServer = apollo.ApolloServer;
