import apollo from 'apollo-server-express';
const {gql} = apollo;

export default gql`
directive @auth(
  required: Boolean = true,
) on OBJECT | FIELD_DEFINITION
`;
