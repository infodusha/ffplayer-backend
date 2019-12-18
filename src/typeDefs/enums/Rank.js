import apollo from 'apollo-server-express';

export const Rank = apollo.gql`
  enum Rank {
    TOP
    EXPERT
    MASTER
  }
`;
