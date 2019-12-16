import {gql} from '../../modules/apollo.js';

export const Client = gql`
   union Client = User | Trainer
`;
