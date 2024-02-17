import RefreshTokenModel from "../models/refreshTokenModel.js";

export class RefreshTokenService {
  async create(data) {
    return await RefreshTokenModel.create(data);
  }
}
