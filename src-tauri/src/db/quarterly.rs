use rusqlite:: {Connection, params};



use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct QuarterlyRecord {
    pub id: i64,
    pub stock_id: i64,
    pub fiscal_year: i64,
    pub fiscal_quarter: i64,
    pub revenue: Option<f64>,
    pub gross_profit: Option<f64>,
    pub operating_income: Option<f64>,
    pub net_income: Option<f64>,
    pub shares_outstanding: Option<f64>,
    pub created_at: String,
}



pub fn get_quarterly_for_stock(
    conn: &Connection,
    stock_id: i64,
) -> Result<Vec<QuarterlyRecord>, String> {
    let mut stmt = conn.prepare(
        "SELECT 
            id, stock_id, fiscal_year, fiscal_quarter, 
            revenue, gross_profit, operating_income, net_income,
            shares_outstanding, currency, created_at
         FROM quarterly
         WHERE stock_id = ?
         ORDER BY fiscal_year DESC, fiscal_quarter DESC"
    ).map_err(|e| e.to_string())?;

    let quarterly_iter = stmt.query_map([stock_id], |row| {
        Ok(QuarterlyRecord {
            id: row.get(0)?,
            stock_id: row.get(1)?,
            fiscal_year: row.get(2)?,
            fiscal_quarter: row.get(3)?,
            revenue: row.get(4)?,
            gross_profit: row.get(5)?,
            operating_income: row.get(6)?,
            net_income: row.get(7)?,
            shares_outstanding: row.get(8)?,
            created_at: row.get(9)?,
        })
    }).map_err(|e| e.to_string())?;

    let records: Vec<QuarterlyRecord> = quarterly_iter.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?;
    Ok(records)
}


// NOTE: Update to use the quarterly struct
pub fn add_record (
    conn: &Connection, 
    stock_id: i64, 
    fiscal_year: i64, 
    fiscal_quarter: i64,
    revenue: f64,
    gross_profit: f64,
    operating_income: f64,
    net_income: f64,
    shares_outstanding: i64,

) -> Result<(), String> {
    conn.execute(
        r#"
        INSERT INTO quarterly (
            stock_id,
            fiscal_year,
            fiscal_quarter,
            revenue,
            gross_profit,
            operating_income,
            net_income,
            shares_outstanding
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        "#,
        params![
            stock_id,               // stock_id
            fiscal_year,            // fiscal_year
            fiscal_quarter,         // fiscal_quarter
            revenue,                // revenue (REAL -> f64)
            gross_profit,           // gross_profit
            operating_income,       // operating_income
            net_income,             // net_income
            shares_outstanding,     // shares_outstanding
        ],
    )
    .map_err(|e| e.to_string())?; // convert rusqlite::Error -> String 

    Ok(())

}