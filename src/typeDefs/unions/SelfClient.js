import {gql} from '../../modules/apollo.js';

export const SelfClient = gql`
   union SelfClient = SelfUser | SelfTrainer
`;
