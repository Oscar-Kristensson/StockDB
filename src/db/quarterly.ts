import { invoke } from "@tauri-apps/api/core";
import { printError } from "../utils";
import * as utils from "../utils";


export class QuarterlyReport {
    constructor(
        public readonly id: number,
        public readonly stock_id: number,
        public fiscal_year: number,
        public fiscal_quarter: number,
        public revenue: number | null,
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
            typeof obj.revenue === "number" &&
            typeof obj.grossProfit === "number" &&
            typeof obj.operatingIncome === "number" &&
            typeof obj.netIncome === "number" &&
            typeof obj.sharesOutstanding === "number"
        );
    }

    static fromDto(dto: any): QuarterlyReport {
        return new QuarterlyReport(
            dto.id,
            dto.stock_id,
            dto.fiscal_year,
            dto.fiscal_quarter,
            dto.revenue ?? null,
            dto.gross_profit ?? null,
            dto.operating_income ?? null,
            dto.net_income ?? null,
            dto.shares_outstanding ?? null
        );
    }

    public get totalPeriod() : number {
        return utils.calcTotalPeriod(this.fiscal_year, this.fiscal_quarter);
    }

    static getCSVHeaderRow() : string {
        return "ID, StockID, Year, Quarter, Revenue, Profit, OprIncome, NetIncome"
    }

    getCSVRow() : string {

        return `${this.id}, ${this.stock_id}, ${this.fiscal_year}, ${this.fiscal_quarter}, ${this.revenue}, ${this.gross_profit}, ${this.operating_income}, ${this.net_income}`

    }
}

/**
 * 
 * @param stockId 
 * @returns 
 */
export function getQuarterlyFromStockID(stockId: Number) : Promise<Array<QuarterlyReport>> {
    console.log(stockId);
    return new Promise((resolve, reject) => {
        invoke("db_get_quarterly_from_stock_id", { stockId: stockId })
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
    revenue: number,
    gross_profit: number,
    operating_income: number,
    net_income: number,
    shares_outstanding: number,
    currency: String,

) {
    return new Promise((resolve, reject) => {
        invoke("db_add_quarterly", {
            stockId: stock_id,
            fiscalYear: fiscal_year,
            fiscalQuarter: fiscal_quarter,
            revenue: revenue,
            grossProfit: gross_profit,
            operatingIncome: operating_income,
            netIncome: net_income,
            sharesOutstanding: shares_outstanding,
            currency: currency,
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


