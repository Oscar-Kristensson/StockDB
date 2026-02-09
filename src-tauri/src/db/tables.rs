use rusqlite::{Connection, Result};

pub fn create_tables(conn: &Connection) -> Result<()>{
    // This is a testing table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
        ",
        [],
    )?;


    conn.execute(
        r#"
CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY,
    ticker TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    exchange TEXT NOT NULL,
    sector TEXT CHECK (sector IN (
        'Communication Services',
        'Consumer Discretionary',
        'Consumer Staples',
        'Energy',
        'Financials',
        'Health Care',
        'Industrials',
        'Information Technology',
        'Materials',
        'Real Estate',
        'Utilities'
    )),

    industry TEXT,
    currency TEXT default 'kr'
);            

        "#,
        []
    )?;

    Ok(())

}

pub fn get_table_names(conn: &Connection) -> Result<Vec<String>> {
    let mut stmt = conn.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
    )?;

    let table_itr = stmt.query_map([], |row| {
        row.get::<_, String>(0)
    })?;

    let mut tables: Vec<String> = Vec::new();

    for table in table_itr {
        let table_name: String = table?;
        tables.push(table_name);
    }

    Ok(tables)
}