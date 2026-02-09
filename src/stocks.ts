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
        public industry: string | null,
        public currency: string = "kr",
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