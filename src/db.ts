import { invoke } from "@tauri-apps/api/core";
import { StockInfo } from "./stocks";


export function dbAddUser(name:string) {
    console.log("Adding user");
    invoke("db_add_user", {
        name: name,
    })
}


export function dbDebugTable(table: string) {
    return invoke("db_debug_table", {
        table: table,
    })
    .then(result => {
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

export function dbGetStockInfoById(id: number) {
    console.log("Fetching stock info!", id);
    if (id < 0) {
        //reject(new Error(`The id must be a positive number, not ${id}`));
    }

    invoke("db_get_stock_info_by_id", {
        id: id,
    })
    .then(rv => {
        console.log(rv);
        //resolve(rv);
    })    
    /*return new Promise((resolve, reject) => {

    })*/
}

export function dbAddStock(stock: StockInfo) {
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


    console.log("Adding stock!");

}