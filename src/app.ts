import express from 'express'
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import bodyParser from 'body-parser';



const app = express();

import middlewares from './middlewares/errors.js';
import AuthRoutes from './routes/api/Auth.js';
import AdminRoutes from './routes/api/Admin.js';

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(xss());
app.use(express.json());

import dotenv from 'dotenv'

import "./auth/passport"
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.set('view engine', 'ejs');
//Routes
app.get('/', (req, res) => {
    res.send('Hello My Boy just enjoy')
  })
app.use('/api/v1',AuthRoutes);
app.use('/api/v1',AdminRoutes);



app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;