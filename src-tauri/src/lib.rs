mod db;

use rusqlite::{Connection, Result, params};
use tauri::State;

use std::sync::Mutex;


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[tauri::command]
fn my_test_command() {
    println!("myTestCommand")
}




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

#[tauri::command]
fn db_add_user(db: State<db::DbConn>, name: &str) {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "INSERT INTO users (name) VALUES (?1)",
        params![name],
    ).unwrap();

}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = db::init().expect("Falied to initalize DB");
    let db_conn = db::DbConn(std::sync::Mutex::new(conn));
    //db_test();
    //let user_id: i32 = 1;
    //println!("{}", read_one_user(user_id).unwrap().name);
    println!("Before print table");
    db::print_table(&db_conn);
    //print_tables();
    //delete_table("user");




    tauri::Builder::default()
        .manage(db_conn)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            my_test_command,
            db_add_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



