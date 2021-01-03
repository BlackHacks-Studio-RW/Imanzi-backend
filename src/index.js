import express from 'express';
import 'dotenv/config.js';
import fileupload from 'express-fileupload';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload({
  useTempFiles: true
}));

app.use('/', router);

app.listen(PORT, () => {
  console.log('Server has started at port', PORT);
});

export default app;