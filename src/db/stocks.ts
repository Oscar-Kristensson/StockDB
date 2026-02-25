import { invoke } from "@tauri-apps/api/core";









export enum StockSectors {
    CommunicationServices = 'CommunicationServices',
    ConsumerDiscretionary = 'ConsumerDiscretionary',
    ConsumerStaples = 'ConsumerStaples',
    Energy = "Energy",
    Financials = "Financials",
    HealthCare = "HealthCare",
    Industrials = "Industrials",
    InformationTechnology = "InformationTechnology",
    Materials = "Materials",
    RealEstate = "RealEstate",
    Utilities = "Utilities",
    
}


export function isStockSector(value: string): value is StockSectors {
    return Object.values(StockSectors).includes(value as StockSectors);
}

export class StockInfo {
    constructor(
        public readonly id: number,
        public ticker: string,
        public name: string,
        public exchange: string,
        public sector: StockSectors | null,
        public industry: string | null,
        public currency: string = "SEK",
    ) {}

    static validate(obj: any): obj is StockInfo {
        return (
            obj !== null &&
            typeof obj === "object" &&
            typeof obj.id === "number" &&
            typeof obj.ticker === "string" &&
            typeof obj.name === "string" &&
            typeof obj.exchange === "string" &&
            typeof obj.currency === "string" &&
            ("sector" in obj) &&
            ("industry" in obj)
        );
    }
}



export class StockListItem {
    constructor(
        public id: number,
        public ticker: string,
        public name: string,
    ) {}

    static validate(obj: any): obj is StockListItem {
        return (
            obj !== null &&
            typeof obj === "object" &&
            typeof obj.id === "number" &&
            typeof obj.ticker === "string" &&
            typeof obj.name === "string"
        );
    }
}



export function getAllStocks() : Promise<Array<StockListItem> | null> {
    return new Promise((resolve, reject) => {
        invoke("db_get_all_stocks", {})
        .then(result => {
            if (result === null)
                resolve(null);

            if (!(result instanceof Array)) {
                throw new Error(`The backend did not return an array, the backend returned ${result}`);
            }

            const array: Array<StockListItem> = []

            for (let i = 0; i < result.length; i++) {
                let singleStock = result[i];
                if (!StockListItem.validate(singleStock)) {
                    throw new Error(`The backend did not return a valid StockInfo object, the backend returned ${result[i]}`);
                }

                const stockListItem = new StockListItem(
                    result[i].id,
                    result[i].ticker,
                    result[i].name,

                )

                array.push(stockListItem);

            }


 
            

            resolve(array);

        })
        .catch(error => {reject(error)});
    });

}







