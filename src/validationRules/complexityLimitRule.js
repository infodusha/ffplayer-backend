import gvc from 'graphql-validation-complexity';
import config from '../../config.json';

export const complexityLimitRule = gvc.createComplexityLimitRule(config.apollo.maxQueryCost, {
  formatErrorMessage(cost) {
    return `Query cost ${cost} exceeds complexity limit`;
  },
});
