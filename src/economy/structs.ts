import { QuarterlyReport, ReportType } from "../db";
import { calcDataAverage } from "./statistics"
import * as utils from "../utils"




export class StockStat<T> {
    constructor(
        readonly name: string,
        readonly allYears: T,
        readonly tenYear: T,
        readonly fiveYear: T,
        readonly oneYear: T,
        readonly previous: T,
    ) {

    }
}


export class StockStatistics {
    constructor(
        readonly returnOnEquity: StockStat<number | undefined>,
        readonly pricePerEquity: StockStat<number | undefined>,
        readonly equityPerShare: StockStat<number | undefined>,
        readonly earningsPerShare: StockStat<number | undefined>,
        readonly sharePrice: StockStat<number | undefined>,
        readonly dividend: StockStat<number | undefined>,
        readonly yearly: boolean = false,
    ) {

    }

    static fromQuarterlyReports(reports: Array<QuarterlyReport>, reportType: ReportType = "Yearly") {
        

        const returnOnEquity = calcDataAverages(reports, "return_on_equity", reportType);
        const pricePerEquity = calcDataAverages(reports, "price_per_equity", reportType);
        const equityPerShare = calcDataAverages(reports, "equity_per_share", reportType);
        const earningsPerShare = calcDataAverages(reports, "earnings_per_share", reportType);
        const sharePrice = calcDataAverages(reports, "share_price", reportType);
        const dividend = calcDataAverages(reports, "dividend", reportType);


        return new StockStatistics(returnOnEquity, pricePerEquity, equityPerShare, earningsPerShare, sharePrice, dividend);

    }
}



export function calcDataAverages(quarterlyRecords: Array<QuarterlyReport>, key: keyof QuarterlyReport, reportType: ReportType = "Yearly") {
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const currentQuarter = utils.getCurrentQuarter(now);

    let str = QuarterlyReport.getCSVHeaderRow();
    quarterlyRecords.forEach(r => {
        str += "\n" + r.getCSVRow();
    })

    const revenueData: Array<utils.DtPoint<number | null>> = quarterlyRecords.flatMap(record => {  // .map(record => {
        let value = null;
        if (typeof record[key] === "number") {
            value = record[key];
        }

        const dp = new utils.DtPoint<number | null>(record.totalPeriod, value);

        if (reportType === "All") {
            return [dp];
        } else if (reportType === "Yearly" && record.fiscal_quarter === 0) {
            return [dp];

        } else if (reportType === "Quarterly" && record.fiscal_quarter !== 0) {
            return [dp];
        }

        return [];

    } );

    console.log(revenueData);

    let calcFromQuarter = 0;

    if (reportType === "Quarterly"){ 
        calcFromQuarter = currentQuarter;
    }
    

    const yearAllAvgRevenue = utils.getAverageS(undefined, undefined, revenueData)?.average;
    const year1AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 1, calcFromQuarter), utils.calcTotalPeriod(year, calcFromQuarter), revenueData)?.average;
    const year10AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 10, calcFromQuarter), utils.calcTotalPeriod(year, calcFromQuarter), revenueData)?.average;
    const year5AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 5, calcFromQuarter), utils.calcTotalPeriod(year, calcFromQuarter), revenueData)?.average;


    let latestValue: number = 0;
    revenueData.forEach(dp => {
        if (dp.data !== null && dp.data > latestValue) {
            latestValue = dp.data;
        }
    })

    


    //const year10AvgRevenue = calcDataAverage(year, currentQuarter, 10, revenueData); // utils.getAverageS(utils.calcTotalPeriod(year - 10, quarter), utils.calcTotalPeriod(year, quarter), revenueData);
    //const year5AvgRevenue = calcDataAverage(year, currentQuarter, 5, revenueData); // utils.getAverageS(utils.calcTotalPeriod(year - 5, quarter), utils.calcTotalPeriod(year, quarter), revenueData);
    //const year1AvgRevenue = calcDataAverage(year, quarter, 1, revenueData); // utils.getAverageS(utils.calcTotalPeriod(year - 1, quarter), utils.calcTotalPeriod(year, quarter), revenueData);
    console.log(year1AvgRevenue);

    return new StockStat<number | undefined>(key, yearAllAvgRevenue, year10AvgRevenue, year5AvgRevenue, year1AvgRevenue, latestValue);
    
}