export const SelfClient = {
  SelfClient: {
    __resolveType(user, context, info) {
      if (user.rank !== null && user.rank !== undefined) {
        return 'SelfTrainer';
      }

      return 'SelfUser';
    },
  },
};
