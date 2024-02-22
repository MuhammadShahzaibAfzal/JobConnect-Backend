import UserModel from "../models/userModel.js";

class UserService {
  async create(data) {
    return await UserModel.create(data);
  }

  async getUser(filter, projection = "-__v") {
    return await UserModel.findOne(filter, projection);
  }

  async updateUser(_id, data) {
    return await UserModel.findByIdAndUpdate(_id, data);
  }
}

export default UserService;
