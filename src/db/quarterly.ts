import { invoke } from "@tauri-apps/api/core";
import { printError } from "../utils";
import * as utils from "../utils";


export class QuarterlyReport {
    constructor(
        public readonly id: number,
        public readonly stock_id: number,
        public fiscal_year: number,
        public fiscal_quarter: number,

        public return_on_equity: number | null,
        public price_per_equity: number | null,
        public equity_per_share: number | null,
        public earnings_per_share: number | null,
        public share_price: number | null,
        public dividend: number | null,
    
    ) {}

    static validate(obj: any): obj is QuarterlyReport {
        return (
            obj !== null &&
            typeof obj === "object" &&
            typeof obj.id === "number" &&
            typeof obj.stock_id === "number" &&
            typeof obj.fiscalYear === "number" &&
            typeof obj.fiscalQuarter === "number" &&
            typeof obj.return_on_equity === "number" &&     // NOTE: Should this not be able to be null?
            typeof obj.price_per_equity === "number" &&
            typeof obj.equity_per_share === "number" &&
            typeof obj.earnings_per_share === "number" &&
            typeof obj.share_price === "number" &&
            typeof obj.dividend === "number"  
        );
    }

    static fromDto(dto: any): QuarterlyReport {
        return new QuarterlyReport(
            dto.id,
            dto.stock_id,
            dto.fiscal_year,
            dto.fiscal_quarter,
            dto.return_on_equity ?? null,
            dto.price_per_equity ?? null,
            dto.equity_per_share ?? null,
            dto.earnings_per_share ?? null,
            dto.share_price ?? null,
            dto.dividend ?? null,
        );
    }

    public get totalPeriod() : number {
        return utils.calcTotalPeriod(this.fiscal_year, this.fiscal_quarter);
    }

    static getCSVHeaderRow() : string {
        return "ID, StockID, Year, Quarter, Revenue, Profit, OprIncome, NetIncome (THIS IS WRONG)"
    }

    getCSVRow() : string {

        return `(THIS IS WRONG) ${this.id}, ${this.stock_id}, ${this.fiscal_year}, ${this.fiscal_quarter}, ${this.return_on_equity}, ${this.price_per_equity}, ${this.equity_per_share}, ${this.id}`

    }
}

export type ReportType = "Yearly" | "Quarterly" | "All";

/**
 * 
 * @param stockId 
 * @returns 
 */
export function getQuarterlyFromStockID(stockId: Number, reportType: ReportType) : Promise<Array<QuarterlyReport>> {
    return new Promise((resolve, reject) => {
        invoke("db_get_quarterly_from_stock_id", { stockId: stockId, reportType: reportType })
        .then(rv => {
            const array: Array<QuarterlyReport> = [];
            if (!(rv instanceof Array)) {
                throw new Error("The return value was not an array");
            }
            rv.forEach(obj => {
                array.push(QuarterlyReport.fromDto(obj));
            })


            resolve(array);
        })
        .catch(error => {
            printError(error, getQuarterlyFromStockID);
            reject(error);
        })
    })
}

export function addQuarterly(
    stock_id: number,
    fiscal_year: number,
    fiscal_quarter: number,
    return_on_equity: number,
    price_per_equity: number,
    equity_per_share: number,
    earnings_per_share: number,
    share_price: number,
    dividend: number,
) {
    return new Promise((resolve, reject) => {
        invoke("db_add_quarterly", {
            stockId: stock_id,
            fiscalYear: fiscal_year,
            fiscalQuarter: fiscal_quarter,
            returnOnEquity: return_on_equity,
            pricePerEquity: price_per_equity,
            equityPerShare: equity_per_share,
            earningsPerShare: earnings_per_share,
            sharePrice: share_price,
            dividend: dividend,
        })
        .then(rv => {
            resolve(rv);
            //resolve(rv);
        }) 
        // The rust errors should be structured to improve error handeling
        .catch(error => {
            printError(error, addQuarterly);
            reject(error);
        })       
    })
}


