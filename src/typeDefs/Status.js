import {gql} from '../modules/apollo.js';

export const Status = gql`
  type Status {
    id: Int!
    online: Boolean!
  }
`;
