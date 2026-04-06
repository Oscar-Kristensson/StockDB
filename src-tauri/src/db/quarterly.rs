use rusqlite:: {Connection, params};



use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct QuarterlyRecord {
    pub id: i64,
    pub stock_id: i64,
    pub fiscal_year: i64,
    pub fiscal_quarter: i64,
    pub return_on_equity: Option<f64>,
    pub price_per_equity: Option<f64>,
    pub equity_per_share: Option<f64>,
    pub earnings_per_share: Option<f64>,
    pub share_price: Option<f64>,
    pub dividend: Option<f64>,
    pub created_at: String,
}



pub fn get_quarterly_for_stock(
    conn: &Connection,
    stock_id: i64,
) -> Result<Vec<QuarterlyRecord>, String> {
    let mut stmt = conn.prepare(
        "SELECT 
            id, stock_id, fiscal_year, fiscal_quarter, 
            returnOnEquity, pricePerEquity, equityPerShare, earningsPerShare,
            sharePrice, dividend, created_at
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
            return_on_equity: row.get(4)?,
            price_per_equity: row.get(5)?,
            equity_per_share: row.get(6)?,
            earnings_per_share: row.get(7)?,
            share_price: row.get(8)?,
            dividend: row.get(9)?,
            created_at: row.get(10)?,
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
    return_on_equity: Option<f64>,
    price_per_equity: Option<f64>,
    equity_per_share: Option<f64>,
    earnings_per_share: Option<f64>,
    share_price: Option<f64>,
    dividend: Option<f64>,

) -> Result<(), String> {
    conn.execute(
        r#"
        INSERT INTO quarterly (
            stock_id,
            fiscal_year,
            fiscal_quarter,
            returnOnEquity,
            pricePerEquity,
            equityPerShare,
            earningsPerShare,
            sharePrice,
            dividend,
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        "#,
        params![
            stock_id,               // stock_id
            fiscal_year,            // fiscal_year
            fiscal_quarter,         // fiscal_quarter
            return_on_equity,
            price_per_equity,
            equity_per_share,
            earnings_per_share,
            share_price,
            dividend,    
        ],
    )
    .map_err(|e| e.to_string())?; // convert rusqlite::Error -> String 

    Ok(())

}