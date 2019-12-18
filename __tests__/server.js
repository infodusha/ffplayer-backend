import {createTestClient} from 'apollo-server-testing';
import apollo from 'apollo-server-express';
import {resolvers} from '../src/resolvers/index.js';
import {schemaDirectives} from '../src/schemaDirectives/index.js';
import {typeDefs} from '../src/typeDefs/index.js';
import {News} from '../src/dataSources/News.js';

describe('Server', () => {
  let client;
  beforeAll(() => {
    const news = new News();
    news.list = jest.fn().mockReturnValueOnce([
      {id: 1, date: new Date('10.11.2019')},
    ]);

    const context = () => ({user: {id: 1}, ip: '1.1.1.1'});

    const server = new apollo.ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      context,
      dataSources: () => ({news}),
    });

    client = createTestClient(server);
  });

  it('Fetch news', async () => {
    const NEWS_QUERY = apollo.gql`query($length: Int!) {
      news(length: $length) {
        id
        date
      }
    }`;
    const res = await client.query({query: NEWS_QUERY, variables: {length: 1}});
    expect(res).toMatchSnapshot();
  });
});
