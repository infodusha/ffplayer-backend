import {gql} from '../../modules/apollo.js';

export const auth = gql`
directive @auth(
  required: Boolean = true,
) on OBJECT | FIELD_DEFINITION
`;
