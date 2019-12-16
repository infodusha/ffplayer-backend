import graphqlM, * as graphqlC from 'graphql';
const graphql = graphqlM || graphqlC;
export const GraphQLScalarType = graphql.GraphQLScalarType;
export const defaultFieldResolver = graphql.defaultFieldResolver;
