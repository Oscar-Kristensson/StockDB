use std::sync::Mutex;
use rusqlite::{Connection, Result, params};
use std::path::PathBuf;

use tauri::State;

use rusqlite::types::Value;

pub struct DbConn(pub Mutex<Connection>);



pub fn init(data_dir: &PathBuf) -> Result<Connection> {
    //let path = "../user_data/example.db";



    let conn = Connection::open(data_dir)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
        ",
        [],
    )?;

    Ok(conn)
}



pub fn debug_table(db: State<DbConn>, table: &str) -> Vec<Vec<String>> {
    // NOTE (IMPORTANT): sanitze table str

    println!("Debugging table {}", table);
    
    // Lock the connection
    let conn = db.0.lock().unwrap();


    let sql = format!("SELECT * FROM {}", table);
    let mut stmt = conn.prepare(&sql).unwrap();

    let column_names: Vec<String> = stmt.column_names().iter().map(|s| s.to_string()).collect();
    let column_count = column_names.len();

    println!("Column names: {:?} (length {})", column_names, column_count);

    let mut rv: Vec<Vec<String>> = Vec::new();


    // Iterate over rows
    let rows = stmt.query_map([], |row: &rusqlite::Row| {
        println!("Row iter {}", column_count);
        let mut values: Vec<String> = Vec::new();
        for i in 0..column_count {
            let value: Value = row.get(i)?;
            let value_str = match value {
                    Value::Null => "NULL".to_string(),
                    Value::Integer(n) => n.to_string(),
                    Value::Real(f) => f.to_string(),
                    Value::Text(s) => s,
                    Value::Blob(_) => "<BLOB>".to_string(),
            };
            // println!("Row {}: {}", i, value_str);

            values.push(value_str);
        }
        /*for i in 0..row.column_count() {
            // Convert each value to string for printing
            let value: Result<String> = row.get(i);
            values.push(value.unwrap_or_else(|_| "NULL".to_string()));
        }*/

        rv.push(values.clone());


        Ok(values)
    }).unwrap();


    
    for _ in rows {
        // nothing else needed; the closure already prints
    }
    /* 
    // Print the column names
    println!("{:?}", column_names);

    // Print each row
    for row in rows {
        let row = row?;
        println!("{:?}", row);
    }
    */
    // rows
    rv

}



#[derive(Debug)]
pub struct User {
    pub id: i32,
    pub name: String,
}

pub fn print_table(db: &DbConn) {
    let conn = db.0.lock().unwrap();

    let mut stmt = conn.prepare("SELECT id, name FROM users").unwrap();

    let user_iter = stmt.query_map([], |row: &rusqlite::Row| {
        Ok(User {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).unwrap();

    for user in user_iter {
        let user: User = user.expect("Failed to parse row");
        println!("User {}: {}", user.id, user.name);
    }
}
