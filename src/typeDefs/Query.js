import apollo from 'apollo-server-express';
const {gql} = apollo;

export default gql`
  type Query {
    getTrainers(rank: Rank, streamer: Boolean): [Trainer]
    getToken(code: String!): String @auth(required: false)
  }
`;
