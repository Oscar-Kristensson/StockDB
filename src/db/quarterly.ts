import { invoke } from "@tauri-apps/api/core";
import { printError } from "../utils";
import * as utils from "../utils";


export class QuarterlyReport {
    static keys: Array<[keyof QuarterlyReport, string]> = [
        ["revenue",                     "Revenue"],
        ["gross_profit",                "Gross profit"],
        ["operating_income",            "Operating income"],
        ["net_income",                  "Net income"],
        ["shares_outstanding",          "Shares outstanding"],
        ["total_shareholders_equity",   "Total Shareholders Equity"],
        ["share_price",                 "Share price"],
        ["dividend",                    "Dividend"],
    ]
    constructor(
        public readonly id: number,
        public readonly stock_id: number,
        public fiscal_year: number,
        public fiscal_quarter: number,      // The quarter 0 represents a whole year report

        public revenue: number | null,
        public gross_profit: number | null,
        public operating_income: number | null,
        public net_income: number | null,
        public shares_outstanding: number | null,
        public total_shareholders_equity: number | null,
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
            typeof obj.revenue === "number" &&     // NOTE: Should this not be able to be null?
            typeof obj.gross_profit === "number" &&
            typeof obj.operating_income === "number" &&
            typeof obj.net_income === "number" &&
            typeof obj.shares_outstanding === "number" &&
            typeof obj.total_shareholders_equity === "number" &&
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
            dto.revenue ?? null,
            dto.gross_profit ?? null,
            dto.operating_income ?? null,
            dto.net_income ?? null,
            dto.shares_outstanding ?? null,
            dto.total_shareholders_equity ?? null,
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
        return "FIX THIS!!!!!";

        // return `(THIS IS WRONG) ${this.id}, ${this.stock_id}, ${this.fiscal_year}, ${this.fiscal_quarter}, ${this.return_on_equity}, ${this.price_per_equity}, ${this.equity_per_share}, ${this.id}`

    }

    forEach(fn: (key: keyof QuarterlyReport, name: string, index: number) => any){
        let stop: boolean = false;
        for (let i = 0; i < QuarterlyReport.keys.length; i++){
            const keyInfo = QuarterlyReport.keys[i];

            stop = fn(keyInfo[0], keyInfo[1], i);
            if (stop) {
                break;
            }
        }
    }

    /**
     * 
     * @returns - A date presentable to the user
     */
    getReportTimeStringA() : string {
        let str = `${this.fiscal_year}`;
        if (this.fiscal_quarter !== 0){
            str += ` Q${this.fiscal_quarter}`
        }
        return str;

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
    revenue: number,
    gross_profit: number,
    operating_income: number,
    net_income: number,
    shares_outstanding: number,
    total_shareholders_equity: number,
    share_price: number,
    dividend: number,
    update: boolean,
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
            totalShareholdersEquity: total_shareholders_equity,
            sharePrice: share_price,
            dividend: dividend,
            update: update,
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


export function deleteQuarterly(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
        invoke("db_delete_quarterly", {
            id: id,
        })
        .then((rv) => {
            resolve(rv as number);
        })
        .catch((error) => {
            printError(error, deleteQuarterly);
            reject(error);
        });
    });
}


