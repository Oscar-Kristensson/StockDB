use rusqlite:: {Connection, params};



use serde::{Serialize, Deserialize};

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
    pub total_shareholders_equity: Option<f64>,
    pub share_price: Option<f64>,
    pub dividend: Option<f64>,
    pub created_at: String,
}

#[derive(Serialize, Deserialize)]
pub enum ReportType {
    Yearly,
    Quarterly,
    All,
}


pub fn get_quarterly_for_stock(
    conn: &Connection,
    stock_id: i64,
    report_type: ReportType, 
    
    
) -> Result<Vec<QuarterlyRecord>, String> {
let filter = match report_type {
        ReportType::Yearly => "AND fiscal_quarter = 0",
        ReportType::Quarterly => "AND fiscal_quarter BETWEEN 1 AND 4",
        ReportType::All => "",
    };

    let query = format!(
        "SELECT 
            id, stock_id, fiscal_year, fiscal_quarter, 
            revenue, gross_profit, operating_income, net_income, 
            shares_outstanding, total_shareholders_equity, share_price, 
            dividend, created_at
        FROM quarterly
        WHERE stock_id = ?
        {}
        ORDER BY fiscal_year DESC, fiscal_quarter DESC",
        filter
    );

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let quarterly_iter = stmt
        .query_map([stock_id], |row| {
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
                total_shareholders_equity: row.get(9)?,
                share_price: row.get(10)?,
                dividend: row.get(11)?,
                created_at: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let records: Vec<QuarterlyRecord> = quarterly_iter
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(records)}


// NOTE: Update to use the quarterly struct
pub fn add_record(
    conn: &Connection,
    stock_id: i64,
    fiscal_year: i64,
    fiscal_quarter: i64,
    revenue: Option<f64>,
    gross_profit: Option<f64>,
    operating_income: Option<f64>,
    net_income: Option<f64>,
    shares_outstanding: Option<f64>,
    total_shareholders_equity: Option<f64>,
    share_price: Option<f64>,
    dividend: Option<f64>,
    update: bool,
) -> Result<(), String> {
    let sql = if update {
        r#"
        INSERT INTO quarterly (
            stock_id, fiscal_year, fiscal_quarter, revenue, gross_profit,
            operating_income, net_income, shares_outstanding,
            total_shareholders_equity, share_price, dividend
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
        ON CONFLICT(stock_id, fiscal_year, fiscal_quarter) DO UPDATE SET
            revenue = excluded.revenue,
            gross_profit = excluded.gross_profit,
            operating_income = excluded.operating_income,
            net_income = excluded.net_income,
            shares_outstanding = excluded.shares_outstanding,
            total_shareholders_equity = excluded.total_shareholders_equity,
            share_price = excluded.share_price,
            dividend = excluded.dividend
        "#
    } else {
        r#"
        INSERT INTO quarterly (
            stock_id, fiscal_year, fiscal_quarter, revenue, gross_profit,
            operating_income, net_income, shares_outstanding,
            total_shareholders_equity, share_price, dividend
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
        "#
    };

    conn.execute(
        sql,
        params![
            stock_id,
            fiscal_year,
            fiscal_quarter,
            revenue,
            gross_profit,
            operating_income,
            net_income,
            shares_outstanding,
            total_shareholders_equity,
            share_price,
            dividend,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}