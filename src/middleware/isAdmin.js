import { verifyingToken } from '../utils/jwToken.js';

const authMiddleware = {
  verifyAdmin: (req, res, next) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(400).send({ message: 'no token provided' });
      }
      const user = verifyingToken(token);
      if (user.role !== 'admin') {
        return res.status(403).send({ message: 'User not an admin' });
      }next();
    } catch (error) {
      return res.status(401).send({ message: 'Invalid Token' });
    }
  },
};
export default authMiddleware;