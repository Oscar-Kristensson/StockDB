mod db;
mod utils;

use rusqlite::{Result, params, Error};
use tauri::State;
use tauri::Manager;

use std::fs;
use std::path::PathBuf;


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[tauri::command]
fn my_test_command() {
    println!("myTestCommand")
}



/* 
fn db_test() -> Result<()> {
    println!("dbTest running!");
    let conn = Connection::open("../user_data/example.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "INSERT INTO user (name) VALUES (?1)",
        ["Alice"],
    )?;

    println!("SQL Finished!");
    Ok(())
}



#[derive(Debug)]
struct Table {
    name: String,
}
*/
/* 
fn read_one_user(id: i32) -> Result<db::User> {
    let conn = Connection::open("../user_data/example.db")?;

    let user = conn.query_row(
        "SELECT id, name FROM user WHERE id = ?1",
        [id],
        |row| {
            Ok(db::User {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        },
    )?;

    Ok(user)
}




fn print_tables() {
    let conn = Connection::open("../user_data/example.db").unwrap();

    let mut stmt = conn.prepare("SELECT name FROM sqlite_master WHERE type='table'").unwrap();

    let table_iter = stmt.query_map([], |row| {
        Ok( Table {
            name: row.get(0)?,
        }
        )
    })
    .unwrap();


    for table in table_iter {
        let table: Table = table.unwrap();
        println!("Table, name={}", table.name)
    }


}


fn delete_table(table_name: &str) -> Result<()> {
    let conn = Connection::open("../user_data/example.db")?;

    let sql = format!("DELETE FROM {}", table_name);

    println!("SQL {}", &sql);
    match conn.execute(&sql, []) {
            Ok(rows_deleted) => println!("Executed! {} rows deleted.", rows_deleted),
            Err(err) => eprintln!("Failed to execute SQL: {}", err),
    }

    Ok(())
}
*/

#[tauri::command]
fn db_add_user(db: State<db::DbConn>, name: &str) {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "INSERT INTO users (name) VALUES (?1)",
        params![name],
    ).unwrap();

}


#[tauri::command]
fn db_debug_table(db: State<db::DbConn>, table: &str) -> Result<Vec<Vec<String>>, String> {
    if !utils::is_only_letters(&table) {
        return Err("Invalid table name. Tables names may only contain letters.".into());
    }
    

    Ok(db::debug_table(db, table))
}

#[tauri::command]
fn db_get_stock_info_by_id(db: State<db::DbConn>, id: u32) -> Option<db::stocks::StockInformation> {
    let conn = db.0.lock().unwrap();
    let stock_information: Result<Option<db::stocks::StockInformation>, Error> = db::stocks::get_stock_by_id(&conn, id);



    match stock_information {
        Ok(stock) => stock, // Return the stock info
        Err(_) => None,           // Return "null" in JS
    }
    
}

#[tauri::command]
fn db_get_table_names(db: State<db::DbConn>) -> Vec<String> {
    println!("Called");
    let conn = db.0.lock().unwrap();
    println!("Retriving table names");
    let table_names = db::tables::get_table_names(&conn);
    println!("Tables names {:?}", table_names);

    match table_names {
        Ok(names) => names, // Return the stock info
        Err(_) => Vec::new(),           // Return "null" in JS
    }
}


#[tauri::command]
fn db_add_stock(db: State<db::DbConn>, stock: db::stocks::StockInformation) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    if !(utils::is_alphanumeric_or_space(&stock.ticker)) {
        return Err("Invalid stock ticker. Stock ticker may only contain letters.".into());
    }

    if !(utils::is_alphanumeric_or_space(&stock.name)) {
        return Err("Invalid stock name. Stock names may only contain letters.".into());
    }

    if !(utils::is_alphanumeric_or_space(&stock.exchange)) {
        return Err("Invalid stock exchange. Stock exchange may only contain letters.".into());
    }

    if let Some(ind) = stock.industry.as_ref() {
        if !utils::is_alphanumeric_or_space(ind) {
            return Err("Invalid industry name. Industry names may only contain letters.".into());
        }
    }

    
    db::stocks::add_stock(&conn, &stock).map_err(|e| e.to_string())

}




fn assure_folder_structure(data_dir_path: &PathBuf) {
    println!("Data dir: {}", data_dir_path.display());
    // Create the directory if it doesn't exist (like 'mkdir -p')
    if !data_dir_path.exists() {
        println!("The dir does not exist!");
        fs::create_dir_all(&data_dir_path).unwrap();
    }

    // Create a database directory
    let database_dir = data_dir_path.join("databases");
    println!("DB dir: {}", database_dir.display());
    if !database_dir.exists() {
        fs::create_dir_all(&database_dir).unwrap();
    }

}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Get the handle to the app-specific local data directory
            // This automatically resolves to the correct OS folder
            println!("Setup");
            let data_dir = app.path().app_local_data_dir()
                .expect("failed to resolve app local data dir");

            assure_folder_structure(&data_dir);

            let db_dir = data_dir.join("databases").join("example.db");
            let conn = db::init(&db_dir).expect("Falied to initalize DB");
            let db_conn = db::DbConn(std::sync::Mutex::new(conn));
            
            
            // println!("Before print table");
            
            //db::print_table(&db_conn);

            app.manage(db_conn);

            let file_path = data_dir.join("init.log");
            println!("Creating log!");
            fs::write(file_path, "App started!")?;
            println!("Created log!");

            Ok(())
        })
        //.manage(db_conn)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            my_test_command,
            db_add_user,
            db_debug_table,
            db_get_stock_info_by_id,
            db_get_table_names,
            db_add_stock
            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



