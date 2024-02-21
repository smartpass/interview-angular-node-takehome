# Server
This is the backend server for the SmartPass interview takehome.

## Components

### Sqlite Database
The server stores its data in an in-memory [SQLite](https://www.sqlite.org/index.html) database. On startup, some seed data is generated and inserted into the database.

### Express Server
The server uses express for handling HTTP requests, and the [ws](https://github.com/websockets/ws) Websocket library for managing websocket connections.
