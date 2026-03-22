import * as db from "../db"
import * as utils from "../utils"

class Stock {
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
        })        
    }


    loadData(reload: boolean = false) {
        // If not reloading, do not reload the data
        if (!reload && (!this._data || this._data.length)) {
            return
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


}