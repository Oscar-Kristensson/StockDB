import * as db from "../db"
import * as utils from "../utils"
import { computeStockMetricsSummary, StockMetricsSummary, PeriodType, computeDerivedMetrics } from "./calculations"
import { CompleteQuarterlyData } from "./structs";


export class Stock {
    list: db.StockListItem;
    _info: db.StockInfo | undefined;
    private _data: Array<CompleteQuarterlyData> | undefined;
    _averages: StockMetricsSummary | undefined;
    
    event: utils.EventSystem;

    constructor(
        list: db.StockListItem, 
        info: db.StockInfo | undefined = undefined, 
        data: Array<CompleteQuarterlyData> | undefined = undefined,
    ) {
        this.list = list;
        this._info = info;
        this._data = data;
        this.event = new utils.EventSystem();
    }


    loadInfo(reload: boolean = false) {
        // If not reloading, do not reload the data
        if (!reload && this._info) {
            return
        }


        return db.getStockInfoById(this.list.id)
        .then(result => {
            // There was no such stock
            if (result === null) {
                return;
            }

            this._info = result;
            this.event.post("update.info");
            return this._info;
        })        
    }


    loadData(reload: boolean = false) {
        // If not reloading, do not reload the data
        if (reload && (!this._data || this._data.length === 0)) {
            console.warn("Failed to load data");
            return;
        }

        return db.getQuarterlyFromStockID(this.list.id, "Yearly")
        .then(result => {

            this.processQuarterlyData(result);
            this.event.post("update.data");
        })
    }



    public get info() : db.StockInfo | undefined {
        return this._info;
    }



    public get data() : Array<db.QuarterlyReport> | undefined {
        return this._data?.map((d) => d.report);
    }

    getData() : Promise<Array<CompleteQuarterlyData> | undefined> {
        return new Promise((resolve, reject) => {
            if (this._data)
                resolve(this._data);

            const dataP = this.loadData()
            if (!dataP)
                reject("Falied to load");


            dataP?.then(_ => {
                if (this._data)
                    resolve(this._data)
                else
                    reject("Failed to load");
            })




        });
    }


    getInfo() : Promise<db.StockInfo> {
        return new Promise(async (resolve) => {
            if (this._info) {
                resolve(this._info);
                return;
            }

            const info = await this.loadInfo();
            
            if (info instanceof db.StockInfo) {
                resolve(info);
            } else {
                throw new Error("Failed to fetch information");
            }
        });

    }

    getStatistics() : Promise<StockMetricsSummary> {
        return new Promise(async (resolve) => {
            await this.getData();
            if (!this._data) {
                throw new Error("Statistics could not be loaded");
            }
            
            if (!this._averages) {
                throw new Error("Averages could not be calculated");

            }


            resolve(this._averages);


            
        })
    

    }

    processQuarterlyData(reports: db.QuarterlyReport[]) {
        reports = reports.sort((a, b) => b.totalPeriod - a.totalPeriod);
        const data: CompleteQuarterlyData[] = reports.map((r) => {
            return {report: r, derived: computeDerivedMetrics(r)};
        });

        this._data = data;

        this._averages = computeStockMetricsSummary(data, "Yearly");

    }


    async getLatestQuarterlyReport(): Promise<CompleteQuarterlyData | undefined> {
        const data = await this.getData();

        if (!data) {
            return undefined;
        }
        return data
            .filter(d => d.report.fiscal_quarter == 0)
            .sort((a, b) => b.report.totalPeriod - a.report.totalPeriod)[0];
    }





}