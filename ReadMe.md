# VideoPortal

VideoPortal is a powerful video streaming system where users can watch many different movies, add comments and other stuff.

## Installation

Use the package manager NPM to install all dependencies VideoPortal.

```bash
npm install
```

##Create .env file
```dotenv
# URI mongoDB and DB name
DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'video-portal'

# Server settings
HTTP_PORT = '8080'
HTTP_HOST = 'localhost'
HTTP_ADDRESS = '0.0.0.0'

# Additional
PATH_TO_MOVIE_DIRECTORY = 'uploads/movies'
```

##Tests
In this project are using [Jest](https://jestjs.io/en/). Use the package manager NPM to run all test.

```bash
npm run test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)