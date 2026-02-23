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
    currency TEXT default 'SEK'
);            

        "#,
        []
    )?;


    conn.execute(r#"
CREATE TABLE IF NOT EXISTS quarterly (
    id INTEGER PRIMARY KEY,

    stock_id INTEGER NOT NULL,

    fiscal_year INTEGER NOT NULL,
    fiscal_quarter INTEGER NOT NULL CHECK (fiscal_quarter BETWEEN 1 AND 4),

    revenue REAL,                         -- total revenue
    gross_profit REAL,
    operating_income REAL,
    net_income REAL,

    shares_outstanding REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (stock_id) REFERENCES stock(id) ON DELETE CASCADE,

    UNIQUE (stock_id, fiscal_year, fiscal_quarter)
);           

        "#, []
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