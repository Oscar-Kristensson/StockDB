import { invoke } from "@tauri-apps/api/core";
import { printError } from "../utils"


export class QuarterlyReport {
    constructor(
        public readonly id: number,
        public readonly stock_id: number,
        public fiscalYear: number,
        public fiscalQuarter: number,
        public gross_profit: number | null,
        public operating_income: number | null,
        public net_income: number | null,
        public shares_outstanding: number | null,
    ) {}

    static validate(obj: any): obj is QuarterlyReport {
        return (
            obj !== null &&
            typeof obj === "object" &&
            typeof obj.id === "number" &&
            typeof obj.stock_id === "number" &&
            typeof obj.fiscalYear === "number" &&
            typeof obj.fiscalQuarter === "number" &&
            typeof obj.gross_profit === "number" &&
            typeof obj.operating_income === "number" &&
            typeof obj.net_income === "number" &&
            typeof obj.operating_income === "number" &&
            typeof obj.shares_outstanding === "number"
        );
    }
}

export function getQuarterlyFromStockID(stockId: Number) {
    console.log(stockId);
    return new Promise((resolve, reject) => {
        invoke("db_get_quarterly_from_stock_id", { stockId: stockId })
        .then(rv => {
            resolve(rv);
        })
        .catch(error => {
            printError(error, getQuarterlyFromStockID);
            reject(error);
        })
    })
}

