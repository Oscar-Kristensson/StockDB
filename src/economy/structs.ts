import { QuarterlyReport } from "../db";
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
        readonly revenue: StockStat<number | undefined>,
    ) {

    }

    static fromQuarterlyReports(reports: Array<QuarterlyReport>) {

        const revenue = calcDataAverages(reports, "revenue");
        console.log("Revenue", revenue);


        return new StockStatistics(revenue);

    }
}



function calcDataAverage(currentYear: number, currentQuarter: number, yearsTime: number, data: Array<utils.DtPoint<number | null>>) {
    const average = utils.getAverageS(utils.calcTotalPeriod(currentYear - yearsTime, currentQuarter), utils.calcTotalPeriod(currentYear, currentQuarter), data);
    console.log("AVG", average, yearsTime);
    if (average === undefined)
        return undefined; 

    if (average.count !== yearsTime * 4) {
        console.log("Test!");
        return undefined;
    }

    return average.average;

}

function calcDataAverages(quarterlyRecords: Array<QuarterlyReport>, key: keyof QuarterlyReport) {
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const quarter = utils.getCurrentQuarter(now);

    let str = QuarterlyReport.getCSVHeaderRow();
    quarterlyRecords.forEach(r => {
        str += "\n" + r.getCSVRow();
    })
    console.log(str);

    const revenueData: Array<utils.DtPoint<number | null>> = quarterlyRecords.map(record => {
        let value = null;
        if (typeof record[key] === "number") {
            value = record[key];
        }
        return new utils.DtPoint<number | null>(record.totalPeriod, value)
    } );
    

    const yearAllAvgRevenue = utils.getAverageS(undefined, undefined, revenueData)?.average;


    const year10AvgRevenue = calcDataAverage(year, quarter, 10, revenueData); // utils.getAverageS(utils.calcTotalPeriod(year - 10, quarter), utils.calcTotalPeriod(year, quarter), revenueData);
    const year5AvgRevenue = calcDataAverage(year, quarter, 5, revenueData); // utils.getAverageS(utils.calcTotalPeriod(year - 5, quarter), utils.calcTotalPeriod(year, quarter), revenueData);
    const year1AvgRevenue = calcDataAverage(year, quarter, 1, revenueData); // utils.getAverageS(utils.calcTotalPeriod(year - 1, quarter), utils.calcTotalPeriod(year, quarter), revenueData);

    return new StockStat<number | undefined>(key, yearAllAvgRevenue, year10AvgRevenue, year5AvgRevenue, year1AvgRevenue, 0);
    
}