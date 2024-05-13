/* istanbul ignore file */

const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const TokenTestHelper = {
  async getAccessToken() {
    const requestPayload = {
      id: 'user-123',
      username: 'dicoding',
    };
    await UsersTableTestHelper.addUser(requestPayload);
    return Jwt.token.generate(requestPayload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = TokenTestHelper;
