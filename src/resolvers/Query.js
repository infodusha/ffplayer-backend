export default {
  Query: {
    getTrainers(parent, {rank, streamer}, {dataSources}) {
      return dataSources.trainers.getTrainers(rank, streamer);
    },
    getToken(parent, args, context) {
      const {ip} = context;
      const {code} = args;
      return 'testtoken';
    },
  },
};
