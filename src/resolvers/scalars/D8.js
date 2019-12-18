
import graphql from 'graphql';
import language from 'graphql/language/index.js';

export const D8 = {
  Date: new graphql.GraphQLScalarType({
    name: 'Date',
    description: 'Date scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral({kind, value}) {
      if (kind === language.Kind.INT) {
        return parseInt(value, 10);
      }
      return null;
    },
  }),
};
