# StockDB
StockDB is a local database for tracking key statistics about stocks. Note that this is my first rust project, so the rust code quality may not be up to standard. StockDB is built using tauri, with the front end being built in TypeScript with vanilla HTML/CSS and the backend built in Rust for handling communications with a SQLite database using rusqlite. 

## Installation
TBD


## Development Setup
Tauri requires specific system dependencies depending on your OS. Please follow [the official Tauri guide](https://v2.tauri.app/start/prerequisites/) for your platform. Then simply clone the repository:

``` bash
git clone https://github.com/Oscar-Kristensson/StockDB.git
```

To run the program in the development environment with npm use the following command:
``` bash
npm run tauri dev
```


## License
See the LICENSE file