import apollo from 'apollo-server-express';

export default apollo.gql`
  enum Rank {
    TOP
    EXPERT
    MASTER
  }
`;
