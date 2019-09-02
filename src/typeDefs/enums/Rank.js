import apollo from 'apollo-server-express';
const {gql} = apollo;

export default gql`
  enum Rank {
    TOP
    EXPERT
    MASTER
  }
`;
