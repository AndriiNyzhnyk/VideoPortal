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
# URI mongoDB and DB name
DB_URL = 'mongodb://localhost:27017'
DB_NAME = 'video-portal'

HTTP_PORT = '8080'
HTTP_HOST = 'localhost'
HTTP_ADDRESS = '0.0.0.0'

PATH_TO_IMAGE_DIRECTORY = 'uploads/images'
PATH_TO_MOVIE_DIRECTORY = 'uploads/movies'
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

Use this [link](https://drive.google.com/drive/folders/1uLXyeMwRmRv4dS6egnlpsFjfFBd7qQy0?usp=sharing) and download all 
needed posters and movies for the test.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)