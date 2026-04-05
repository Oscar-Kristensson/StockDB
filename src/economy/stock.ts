import * as db from "../db"
import * as utils from "../utils"
import { StockStatistics } from "./structs"

export class Stock {
    list: db.StockListItem
    _info: db.StockInfo | undefined
    _data: Array<db.QuarterlyReport> | undefined
    event: utils.EventSystem;

    constructor(list: db.StockListItem, info: db.StockInfo | undefined = undefined, data: Array<db.QuarterlyReport> | undefined = undefined) {
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
        console.log("Loading data", !this._data);
        // If not reloading, do not reload the data
        if (reload && (!this._data || this._data.length === 0)) {
            console.warn("Failed to load data");
            return;
        }

        return db.getQuarterlyFromStockID(this.list.id)
        .then(result => {
            this._data = result;
            this.event.post("update.data");
        })
    }



    public get info() : db.StockInfo | undefined {
        return this._info;
    }



    public get data() : Array<db.QuarterlyReport> | undefined {
        return this._data;
    }

    getData() : Promise<Array<db.QuarterlyReport> | undefined> {
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
        return new Promise(async (resolve, reject) => {
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


    getStatistics() : Promise<StockStatistics> {
        return new Promise(async (resolve) => {
            const data = await this.getData();
            if (!data) {
                throw new Error("Statistics could not be loaded");
            }


            const statistics = StockStatistics.fromQuarterlyReports(data);
            resolve(statistics);


            
        })
    }





}