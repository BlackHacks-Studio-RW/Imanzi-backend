import express from 'express';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
import connectDB from './config/db.js';
import 'dotenv/config.js';
import fileupload from 'express-fileupload';
// import router from './routes/index.js';
import router from './routes/authrouter.js';
// const authrouter = require('./routes/authrouter')
// import router from './routes'
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
const app = express();
const PORT = process.env.PORT || 3000;

connectDB()
// app.use(session({
//   secret: process.env.SECRET_OR_KEY, // a secret key you can write your own 
//   resave: false,
//   saveUninitialized: true
// }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// res.cookie('auth-token', token, [options]);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload({
  useTempFiles: true
}));


// app.use('/', router);
app.use('/', router); 

app.listen(PORT, () => {
  console.log('Server has started at port', PORT);
});

export default app;