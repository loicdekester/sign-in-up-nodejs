# sign-in-up-nodejs
Example to demonstrate how to use [Express](http://expressjs.com/) 4.x, the [Passport](http://www.passportjs.org/) library, to manage different authentication strategies, and the [pg-promise]https://github.com/vitaly-t/pg-promise library to save users to a PostgreSQL database.
This repository is the server side of the application, you can find the front end side in this [repository](https://github.com/loicdekester/sign-in-up-vue). It is a single page application using Vue.js framework.
You can use this example as a starting point for your own web applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone https://github.com/loicdekester/sign-in-up-nodejs.git
$ cd sign-in-up-nodejs
$ npm install
```

To setup the database, create a new postgreSQL database and setup your databse config in src/repository/index.js or in .env file.
Create new projects in [Google Console](https://console.cloud.google.com/) and [Facebook Developers](https://developers.facebook.com/) in order to get App IDs and Keys for the usage of Google and Facebook APIs. You can configure that in src/config/passport.js or in .env file.

Start the server.

```bash
$ npm run dev
```

You can make request to the server with Postman on http://localhost:3000 or install the front end part of the example.
