pub mod stocks;

pub mod tables;

use std::sync::Mutex;
use rusqlite::{Connection, Result};
use std::path::PathBuf;

use tauri::State;

use rusqlite::types::Value;

pub struct DbConn(pub Mutex<Connection>);

pub fn init(data_dir: &PathBuf) -> Result<Connection> {
    //let path = "../user_data/example.db";



    let conn = Connection::open(data_dir)?;

    tables::create_tables(&conn)?;


    Ok(conn)
}




pub fn debug_table(db: State<DbConn>, table: &str) -> Vec<Vec<String>> {
    // NOTE (IMPORTANT): sanitze table str
    // Lock the connection
    let conn = db.0.lock().unwrap();


    let sql = format!("SELECT * FROM {}", table);
    let mut stmt = conn.prepare(&sql).unwrap();

    let column_names: Vec<String> = stmt.column_names().iter().map(|s| s.to_string()).collect();
    let column_count = column_names.len();

    let mut rv: Vec<Vec<String>> = Vec::new();


    // Iterate over rows
    let rows = stmt.query_map([], |row: &rusqlite::Row| {
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

    rv

}



