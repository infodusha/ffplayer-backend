
import language from 'graphql/language/index.js';
import {GraphQLScalarType} from '../../modules/graphql.js';

export const D8 = {
  Date: new GraphQLScalarType({
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
