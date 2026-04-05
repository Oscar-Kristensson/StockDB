

import { invoke } from "@tauri-apps/api/core";
import { StockInfo } from "./stocks";
import { printError } from "../utils";





export function debugTable(table: string, asString = true) {
    return invoke("db_debug_table", {
        table: table,
    })
    .then(result => {
        if (!asString) {
            return result;
        }

        let rv:string = "";
        if (result instanceof Array) {
            result.forEach(row => {
                if (row instanceof Array){
                    row.forEach(element => {
                        if (typeof element === "string")
                            rv += element + "\t";
                    })
                }
                rv += "\n";
            });
        }

        console.log("Table", table, rv);

        return rv;
    })
}


// NOTE: This should be converted to promises
// NOTE: This should have more sophisticated error handling
/**
 * Retrieves a StockInfo struct (or null) in the form of a promise
 * 
 * @param id The ID if the stock in the DB
 * @returns A promise that gets the value null or a StockInfo
 */
export function getStockInfoById(id: number) : Promise<StockInfo | null> {
    return new Promise((resolve, reject) => {
        invoke("db_get_stock_info_by_id", {
            id: id,
        })
        .then(result => {
            if (result === null)
                resolve(null);

            if (!StockInfo.validate(result)) {
                throw new Error(`The backend did not return a valid StockInfo object, the backend returned ${result}`);
            }
            
            const stockInfo = new StockInfo(
                result.id,
                result.ticker,
                result.name,
                result.exchange,
                result.sector,
                result.industry,
                result.currency
            )

            resolve(stockInfo);

        })
        .catch(error => {reject(error)});
    });

}

export function addStock(stock: StockInfo) {
    return new Promise((resolve, reject) => {
        invoke("db_add_stock", {
            stock: stock,
        })
        .then(rv => {
            console.log("Got rv");
            console.log(rv);
            resolve(rv);
            //resolve(rv);
        }) 
        // The rust errors should be structured to improve error handeling
        .catch(error => {
            console.log("Got error!");
            console.error(error);
            reject(error);
        })       
    })



}

export function getTableNames() {
    return new Promise((resolve, reject) => {
        invoke("db_get_table_names", {})
        .then(result => {
            resolve(result);
        })
        .catch(error => {
            printError(error, getTableNames);
            reject(error);
        })
        
    })
}



