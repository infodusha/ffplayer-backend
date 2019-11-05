import apollo from 'apollo-server-express';

export default apollo.gql`
  type SelfUpdate {
    pic: String!
    name: String!
  }
`;
