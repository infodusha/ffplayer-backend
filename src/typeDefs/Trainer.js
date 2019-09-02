import apollo from 'apollo-server-express';
const {gql} = apollo;

export default gql`
  type Trainer implements User {
    id: ID!
    pic: String!
    name: String!
    rate: Float
    rank: Rank!
    streamer: Boolean
  }
`;
