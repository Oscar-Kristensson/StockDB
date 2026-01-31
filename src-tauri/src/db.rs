use std::sync::Mutex;
use rusqlite::{Connection, Result, params};

pub struct DbConn(pub Mutex<Connection>);



pub fn init() -> Result<Connection> {
    let path = "../user_data/example.db";



    let conn = Connection::open(path)?;

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
