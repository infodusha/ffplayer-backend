import apollo from 'apollo-server-express';

export default apollo.gql`
  type Status {
    id: Int!
    online: Boolean!
  }
`;
