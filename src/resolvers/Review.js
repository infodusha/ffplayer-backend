export const Review = {
  Review: {
    user({id}, _, {dataSources}) {
      return dataSources.user.getById(id);
    },
  },
};
