# Sample API with Authentication
Sample NodeJS App with Authentication via JWT

# Getting Started
## Prerequisites
* [NodeJS](https://nodejs.org/en/docs/guides/getting-started-guide/)
* [MongoDB](https://docs.mongodb.com/manual/tutorial/getting-started/)
    * You can also sign up for free account at [MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/) if you don't want to set up your own MongoDB
## Packages
Run `npm install` at the root project directory (same directory level as `package.json`) to install required node packages
## Configurations
* Under sample `.env` file, change the configurations as per individual requirements:
    * `APP_PORT` - port at which the server will run
    * `MONGO_URI` - uri connection string for your mongodb
    * `TOKEN_SECRET` - some secret key of yours, you can also generate it (at every expiry interval) via a random hash function in the app itself to be more secure
    * `N_SALT_ROUNDS` - number of rounds for generating salt (more rounds = more secure, but more compute time)
## API Endpoints
* `/api/user/register`
    * register a new user/email/password into the mongodb database
    * e.g. 
        ```(bash)
        curl -X POST http://localhost:3000/api/user/register \
        -d '{"name": "somename", "email": "someemail@somedomain.com", "password": "somepassword"}'
        ```
* `/api/user/login`
    * login with a registered email & password, a token will be generated and returned in the response headers (under `auth-token`)
    * e.g. 
        ```(bash)
        curl -X POST http://localhost:3000/api/user/login \
        -d '{"email": "someemail@somedomain.com", "password": "somepassword"}'
        ```
* `/api/posts`
    * a mock api functionality, to be replaced with individual requirements
    * requires a valid `auth-token` in the header, generated by `/api/users/login` endpoint
    * e.g. 
        ```(bash)
        curl -X GET http://localhost:3000/api/posts \
        -H 'auth-token: somejwttoken'
        ```
