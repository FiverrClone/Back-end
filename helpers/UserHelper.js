import UserModel from '../models/User.js';

const UserHelper = {
    isUserExists: async (id) => {
      const user = await UserModel.findById(id);
      return user ? true : false;
    },
  };
  
  export default UserHelper;