export default {
  Query: {
    trainers(parent, {rank, streamer}) {
      return [];
    },
    token(parent, args, context) {
      const {ip} = context;
      const {code} = args;
      return 'testtoken';
    },
  },
};
