
# Movie Editors Coding Challenge

Description: This is a fastify api that handles one GET request.

This api will do a series of lookups:

1. Find all of the NBA Teams
2. Find all of the NBA Players
3. Combine the responses into a simple JSON response of draft picks

## Features

- Super fast node api built on Fastify
- Promise.all for batching requests
- In memory processing of NBA Players
- API key loading from .env file

### NOTE:

For this project to work you will need to create a .env file with the following

```Bash
HTTP_PORT=3001
API_TOKEN={{ Your balldontlie.io token }}
```

To run the unit tests

```Bash
npm run test:jest
```

To start the project

```Bash
npm run build
npm run start
```

The app can be further tested using the included .http file or with this curl command
```bash
curl -X GET --location "http://localhost:3001"
```
