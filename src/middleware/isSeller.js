import { verifyingToken } from '../utils/jwToken.js';

const authMiddleware = {
  verifySeller: (req, res, next) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(400).send({ error: 'no token provided' });
      }
      const user = verifyingToken(token);
      if (user.role !== 'seller') {
        return res.status(403).send({ message: 'User not a seller' });
      }next();
    } catch (error) {
      return res.status(401).send({ error: 'Invalid Token' });
    }
  },
};
export default authMiddleware;