const isLoggedIn = "Authentication";
class isLoggedIn {
/**
   * User sign out or log out
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async isLogedIn(req, res, next) {
    if(req.isAuthenticated()){
        next();
    }
    }
}
export default isLoggedIn;