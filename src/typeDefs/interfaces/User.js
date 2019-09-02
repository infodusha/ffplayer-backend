import apollo from 'apollo-server-express';
const {gql} = apollo;

export default gql`
  interface User {
    id: ID
    pic: String
    name: String
  }
`;
