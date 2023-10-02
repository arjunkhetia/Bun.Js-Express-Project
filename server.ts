import express from "express";
import compression from 'compression';
import path from 'path';
import morgan from "morgan";
import fs from 'fs';
import fsr from 'file-stream-rotator';
import helmet from 'helmet';
import ON_DEATH from 'death';
import favicon from 'serve-favicon';
import { create } from 'express-handlebars';
import { LoggerUtil } from './utilities/logger';
import { DataLogger } from './utilities/datalogger';

// Defining routes
import { routes } from './routes';

const app = express();
const port = 3000;
const loggerUtil = new LoggerUtil();
const dataLogger = new DataLogger();

// Linking log folder and ensure directory exists
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.appendFile('./log/ServerData.log', '', function (err) {
  if (err) throw err;
});

// view engine setup - Express-Handlebars
const hbs = create({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/'
});
app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Create a rotating write stream
var rotatingLogStream = fsr.getStream({
  filename: logDirectory + '/Server',
  size: "10M", // rotate every 10 MegaBytes written
  frequency: 'daily', // rotate daily
  audit_file: logDirectory + '/audit.json',
  extension: ".log",
  date_format: "YYYY-MM-DD"
});

// Generating date and time for logger
morgan.token('datetime', function displayTime() {
  return new Date().toString();
});

// Allowing access headers and requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE, CONNECT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// defining mode of logging
app.use(morgan('dev'));
app.use(morgan(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
  stream: rotatingLogStream
}));

// uncomment to redirect global console object to log file
// dataLogger.logfile();

// compress all responses
app.use(compression());

// Helmet helps for securing Express apps by setting various HTTP headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Linking routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  next(err);
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  // uncomment to just send error as JSON
  res.send({"message":"404 Page Not Found..!"});
  // uncomment to render the error page
  // res.render('error');
});

// globally catching unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at promise '+promise+' reason ', reason);
  console.log('Server is still running...\n');
});

// globally catching unhandled exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception is thrown with ',error+'\n');
  process.exit();
});

/**
* Event listener for HTTP server "close" event.
* It sets the callback on SIGINT, SIGQUIT & SIGTERM.
*/
ON_DEATH((signal) => {
  console.log('\nServer is going down now...');
  process.exit();
});

app.listen(port, () => {
  console.log('Bun.js-Express-Server Started on http://localhost:'+port+'\n');
});
