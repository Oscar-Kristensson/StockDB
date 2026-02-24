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
}

export function getQuarterlyFromStockID(stockId: Number) {
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

