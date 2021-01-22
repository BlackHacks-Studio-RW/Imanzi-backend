import { verifyingToken } from '../utils/jwToken.js';

const checkAuth = {
  verifyUser: (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).send({ message: 'no token provided' });
    }
    if (token) {
        try {
          const user = verifyingToken(token);
          req.user = user;
          next();
        } catch (error) {
          return res.status(401).send({ message: 'Invalid Token' });
        }
      
    }
  },
};

export default checkAuth;