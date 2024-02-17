import UserModel from "../models/userModel.js";

class UserService {
  async create(data) {
    return await UserModel.create(data);
  }

  async getUser(filter) {
    return await UserModel.findOne(filter, "-__v -password");
  }
}

export default UserService;
