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
    Real_Estate = "RealEstate",
    Utilities = "Utilities",
}

export class StockInfo {
    constructor(
        public readonly id: number,
        public ticker: string,
        public name: string,
        public exchange: string,
        public sector: StockSectors | null,
        public industry: string,
        public currency: string = "kr",
  ) {}
}