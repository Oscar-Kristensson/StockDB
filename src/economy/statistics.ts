import * as utils from "../utils"





export function calcDataAverage(currentYear: number, currentQuarter: number, yearsTime: number, data: Array<utils.DtPoint<number | null>>) {
    const average = utils.getAverageS(utils.calcTotalPeriod(currentYear - yearsTime, currentQuarter), utils.calcTotalPeriod(currentYear, currentQuarter), data);
    if (average === undefined)
        return undefined; 

    if (average.count !== yearsTime * 4) {
        return undefined;
    }

    return average.average;

}

