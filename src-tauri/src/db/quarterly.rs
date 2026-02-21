use rusqlite:: {Connection, params};



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
    currency: String,

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
            shares_outstanding,
            currency
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        "#,
        params![
            stock_id,              // stock_id
            fiscal_year,           // fiscal_year
            fiscal_quarter,              // fiscal_quarter
            revenue,    // revenue (REAL -> f64)
            gross_profit,      // gross_profit
            operating_income,      // operating_income
            net_income,      // net_income
            shares_outstanding,  // shares_outstanding
            currency          // currency
        ],
    )

    .map_err(|e| e.to_string())?; // convert rusqlite::Error -> String 



    
    Ok(())

}