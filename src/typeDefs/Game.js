import apollo from 'apollo-server-express';

export const Game = apollo.gql`
  type GameSkill {
    name: String!
    pic: String!
  }

  type GamePics {
      icon: String!
      main: String!
      background: String!
      logo: String!
  }

  type Game {
    id: ID!
    name: String!
    shortname: String!
    site: String!
    description: String!
    tags: String!
    pics: GamePics!
    skills: [GameSkill]!
  }
`;
