import apollo from 'apollo-server-express';

export const Status = apollo.gql`
  type Status {
    id: Int!
    online: Boolean!
  }
`;
