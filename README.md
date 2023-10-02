# Bun.js + Express Project   ![Version][version-image]

![Linux Build][linuxbuild-image]
![Windows Build][windowsbuild-image]
![NSP Status][nspstatus-image]
![Test Coverage][coverage-image]
![Dependency Status][dependency-image]
![devDependencies Status][devdependency-image]

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run server.ts
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Logger - Morgan & Winston

Morgan - HTTP request logger middleware for node.js:

```ts
import morgan from "morgan";

// Generating date and time for logger
morgan.token('datetime', function displayTime() {
  return new Date().toString();
});

// defining mode of logging
app.use(morgan('dev'));
app.use(morgan(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
  stream: rotatingLogStream
}));
```

Winston - is designed to be a simple and universal logging library with support for multiple transports:

```ts
import winston from "winston";

public logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({
        all: true
    }),
    winston.format.printf(
        data => `${data.level} : ${data.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'silly'
    }),
    new winston.transports.File({
      level: 'silly',
      filename: './log/ServerData.log'
    })
  ]
});
```

# File Stream Rotator

To provide an automated rotation of Express/Connect logs or anything else that writes to a log on a regular basis that needs to be rotated based on date.

```ts
import fsr from 'file-stream-rotator';

// Create a rotating write stream
var rotatingLogStream = fsr.getStream({
  filename: logDirectory + '/Server',
  size: "10M", // rotate every 10 MegaBytes written
  frequency: 'daily', // rotate daily
  audit_file: logDirectory + '/audit.json',
  extension: ".log",
  date_format: "YYYY-MM-DD"
});
```

[version-image]: https://img.shields.io/badge/Version-1.0.0-orange.svg
[linuxbuild-image]: https://img.shields.io/badge/Linux-passing-brightgreen.svg
[windowsbuild-image]: https://img.shields.io/badge/Windows-passing-brightgreen.svg
[nspstatus-image]: https://img.shields.io/badge/nsp-no_known_vulns-blue.svg
[coverage-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[dependency-image]: https://img.shields.io/badge/dependencies-up_to_date-brightgreen.svg
[devdependency-image]: https://img.shields.io/badge/devdependencies-up_to_date-yellow.svg