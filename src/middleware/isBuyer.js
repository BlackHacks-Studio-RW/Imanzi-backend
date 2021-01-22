import { verifyingToken } from '../utils/jwToken.js';

const authMiddleware = {
  verifyBuyer: (req, res, next) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(400).send({ message: 'no token provided' });
      }
      const user = verifyingToken(token);
      if (user.role !== 'buyer') {
        return res.status(403).send({ message: 'User not a buyer' });
      }next();
    } catch (error) {
      return res.status(401).send({ message: 'Invalid Token' });
    }
  },
};
export default authMiddleware;