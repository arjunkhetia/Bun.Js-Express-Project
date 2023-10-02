import express from 'express';
import { indexRoute } from './routes/index';
import { usersRoute } from './routes/users';

export const routes = express.Router();

routes.use('/', indexRoute);
routes.use('/users', usersRoute);