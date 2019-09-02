import apollo from 'apollo-server-express';

export default apollo.gql`
  interface User {
    id: ID
    pic: String
    name: String
  }
`;
