import UserModel from "../models/userModel.js";

class UserService {
  async create(data) {
    return await UserModel.create(data);
  }
}

export default UserService;
