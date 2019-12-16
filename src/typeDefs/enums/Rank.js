import {gql} from '../../modules/apollo.js';

export const Rank = gql`
  enum Rank {
    TOP
    EXPERT
    MASTER
  }
`;
