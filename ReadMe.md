# VideoPortal

VideoPortal is a powerful video streaming system where users can watch many different movies, add comments and other stuff.

## Installation

Use the package manager NPM to install all dependencies VideoPortal.

```bash
npm i
```

## Create .env file
In the root project directory please create a `.env` file.
```dotenv
# MongoDB settings
DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'video-portal'

# Server settings
HTTP_PORT = '8080'
HTTP_HOST = 'localhost'
HTTP_ADDRESS = '0.0.0.0'

# Path to uploaded movies and posters
PATH_TO_IMAGE_DIRECTORY = 'uploads/images'
PATH_TO_MOVIE_DIRECTORY = 'uploads/movies'

# Credentials
POSTMAN_EMAIL = 'test123@gmail.com'
POSTMAN_PASSWORD = 'TempPass123!'

# Other
JWT2_PLUGIN_KEY = 'NeverShareYourSecret'
JSON_WEB_TOKEN_KEY = 'NeverShareYourSecret'
SERVER_ENCRYPTION_KEY = 'a184b630a935870144e75b7fffdb0701'
SERVER_ENCRYPTION_KEY_IV_LENGTH = '16'
ENCRYPT_DECRYPT_ALGORITHM = 'aes-256-cbc'

```

## Create directories for new movies
In the root project directory please create a directory with name 
"uploads". In this directory("uploads") create two additional directories "images" and "movies".

## Tests
In this project are using [Jest](https://jestjs.io/en/). Use the package manager NPM to run all test.

```bash
npm test
```

## Run test project.

After completed all test, you can check video portal without any additional settings(without adding manually thousand 
the movies and after upload the theme directly to the server)

Use this [link](https://drive.google.com/drive/folders/1Ib0iPCO8dsq_ZSxDStSdN6sR8HJm93Kj?usp=sharing) and download all 
needed posters and movies for the test.

Also, you will find the file "moviesForImport.json" in the root project directory. Please run the command above.

```bash
mongoimport --db video-portal --collection movies --file moviesForImport.json --jsonArray
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)