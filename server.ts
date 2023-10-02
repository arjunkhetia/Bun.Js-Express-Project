import express from "express";
import compression from 'compression';

// Defining routes
import { routes } from './routes';

const app = express();
const port = 3000;

// Allowing access headers and requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE, CONNECT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// compress all responses
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Linking routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
