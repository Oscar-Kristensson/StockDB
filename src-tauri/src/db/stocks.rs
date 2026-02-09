use serde::{Serialize, Deserialize};
use rusqlite:: {Connection, Error};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum StockSectors {
    CommunicationServices,
    ConsumerDiscretionary,
    ConsumerStaples,
    Energy,
    Financials,
    HealthCare,
    Industrials,
    InformationTechnology,
    Materials,
    RealEstate,
    Utilities,
}


impl StockSectors {
    pub fn as_str(&self) -> &'static str {
        match self {
            StockSectors::CommunicationServices => "Communication Services",
            StockSectors::ConsumerDiscretionary => "Consumer Discretionary",
            StockSectors::ConsumerStaples => "Consumer Staples",
            StockSectors::Energy => "Energy",
            StockSectors::Financials => "Financials",
            StockSectors::HealthCare => "Health Care",
            StockSectors::Industrials => "Industrials",
            StockSectors::InformationTechnology => "Information Technology",
            StockSectors::Materials => "Materials",
            StockSectors::RealEstate => "Real Estate",
            StockSectors::Utilities => "Utilities",
        }
    }
}
impl StockSectors {
    pub fn from_str_opt(s: &str) -> Option<Self> {
        match s {
            "Communication Services" => Some(StockSectors::CommunicationServices),
            "Consumer Discretionary" => Some(StockSectors::ConsumerDiscretionary),
            "Consumer Staples" => Some(StockSectors::ConsumerStaples),
            "Energy" => Some(StockSectors::Energy),
            "Financials" => Some(StockSectors::Financials),
            "Health Care" => Some(StockSectors::HealthCare),
            "Industrials" => Some(StockSectors::Industrials),
            "Information Technology" => Some(StockSectors::InformationTechnology),
            "Materials" => Some(StockSectors::Materials),
            "Real Estate" => Some(StockSectors::RealEstate),
            "Utilities" => Some(StockSectors::Utilities),
            _ => None,
        }
    }
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StockInformation {
    pub id: u32,
    pub ticker: String,
    pub name: String,
    pub exchange: String,
    pub sector: Option<StockSectors>,
    pub industry: Option<String>,
    pub currency: String
}



pub fn get_stock_by_id(conn: &Connection, id: u32) -> Result<Option<StockInformation>, Error> {
    let mut stmt = conn.prepare(
        "SELECT ticker, name, exchange, sector, industry, currency FROM stocks WHERE id = ?1"
    )?;

    let mut rows = stmt.query([id])?;


    if let Some(row) = rows.next()? {
        let sector_str: String = row.get(3)?;
        let sector= StockSectors::from_str_opt(&sector_str);

        let stock = StockInformation {
            id: id,
            ticker:     row.get(0)?,
            name:       row.get(1)?,
            exchange:   row.get(2)?,
            sector:     sector,
            industry:   row.get(4)?,
            currency:   row.get(5)?
        };
        Ok(Some(stock))
    } else {
        Ok(None) // no stock found
    }
}


pub fn add_stock(conn: &Connection, stock: &StockInformation) -> Result<(), String> {   
    conn.execute(
        "INSERT INTO stock (ticker, name, exchange, sector, industry, currency) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (
            &stock.ticker, 
            &stock.name, 
            &stock.exchange,
            &stock.sector.as_ref().map(|s| s.as_str()), 
            &stock.industry, 
            &stock.currency),
    )
    .map_err(|e| e.to_string())?; // convert rusqlite::Error -> String

    Ok(())
}