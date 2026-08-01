import { QuarterlyReport, ReportType } from "../db";
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


    let calcFromQuarter = 0;

    if (reportType === "Quarterly"){ 
        calcFromQuarter = currentQuarter;
    }


    // Note: This method of calculating is inefficient, consider improving
    const yearAllAvgRevenue = utils.getAverageS(undefined, undefined, revenueData)?.average;
    const year1AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 1, calcFromQuarter), utils.calcTotalPeriod(year, calcFromQuarter), revenueData)?.average;
    const year10AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 10, calcFromQuarter), utils.calcTotalPeriod(year, calcFromQuarter), revenueData)?.average;
    const year5AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 5, calcFromQuarter), utils.calcTotalPeriod(year, calcFromQuarter), revenueData)?.average;


    // Finds the latset
    let latestValue: number = 0;
    let latestTime: number = 0;
    revenueData.forEach(dp => {
        if (dp.data !== null && dp.time > latestTime) {
            latestValue = dp.data;
            latestTime = dp.time;
        }
    })
  



    return new StockStat<number | undefined>(key, yearAllAvgRevenue, year10AvgRevenue, year5AvgRevenue, year1AvgRevenue, latestValue);
    
}