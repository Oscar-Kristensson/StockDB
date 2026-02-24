import { CustomTableRow } from "../../components/row";
import { CustomLabelElement } from "./customLabel";
import * as utils from "../../utils";
import { QuarterlyReport } from "../../db";

export class TableRowStruct<valueT> {
    element: CustomLabelElement;
    tableElement: HTMLTableCellElement;
    constructor(
        public value: valueT
    ) {
        this.tableElement = utils.createElement("td", undefined, []);
        this.element = new CustomLabelElement(this.tableElement, "")
        this.update(value);
    }

    update(value: valueT) {
        this.value = value;

        if (value === undefined) {
            this.element.update("");
            this.element.setloaded(false);
        } else {
            this.element.setloaded(true);
            this.element.update(String(value));
        }

    }

    

    
}

export class TableRowData {
    latest: TableRowStruct<number | undefined>;
    lastYear: TableRowStruct<number | undefined>;
    last5Years: TableRowStruct<number | undefined>;
    last10Years: TableRowStruct<number | undefined>;
    lastAll: TableRowStruct<number | undefined>;

    constructor(
    ) {
        this.latest = new TableRowStruct(undefined);
        this.lastYear = new TableRowStruct(undefined);
        this.last5Years = new TableRowStruct(undefined);
        this.last10Years = new TableRowStruct(undefined);
        this.lastAll = new TableRowStruct(undefined);
    }

    addTo(container: HTMLDivElement) {
        container.appendChild(this.latest.tableElement);
        container.appendChild(this.lastYear.tableElement);
        container.appendChild(this.last5Years.tableElement);
        container.appendChild(this.last10Years.tableElement);
        container.appendChild(this.lastAll.tableElement);
    }

    setData(
        latest: number | undefined,    
        lastYear: number | undefined,
        last5Years: number | undefined,
        last10Years: number | undefined,
        lastAll: number | undefined,

    ) {
        this.latest.update(latest);
        this.lastYear.update(lastYear);
        this.last5Years.update(last5Years);
        this.last10Years.update(last10Years);
        this.lastAll.update(lastAll);
    }

    setDataS(data: {
    latest: number | undefined;
    lastYear?: number;
    last5Years?: number;
    last10Years?: number;
    lastAll?: number;
    }) {
        this.setData(
            data.latest,
            data.lastYear,
            data.last5Years,
            data.last10Years,
            data.lastAll
        )
    }


    

}


export class OverviewTableRow extends CustomTableRow {
    constructor(
        public parameter: TableRowStruct<string>, 
        public data: TableRowData = new TableRowData(),

    ) {
        super();

        this.container.appendChild(this.parameter.tableElement);

        data.addTo(this.container);
    }
}


export function calcDataAverages(quarterlyRecords: Array<QuarterlyReport>, key: keyof QuarterlyReport) {
    const now: Date = new Date();
    const year: number = now.getFullYear();

    const revenueData = quarterlyRecords.map(record => new utils.DtPoint(record.totalPeriod, record[key]));

    const yearAllAvgRevenue = utils.getAverageS(undefined, undefined, revenueData);
    const year10AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 10, 1), utils.calcTotalPeriod(year, 1), revenueData);
    const year5AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 10, 1), utils.calcTotalPeriod(year, 1), revenueData);
    const year1AvgRevenue = utils.getAverageS(utils.calcTotalPeriod(year - 10, 1), utils.calcTotalPeriod(year, 1), revenueData);

    return {
        latest: 0,
        lastYear: yearAllAvgRevenue,
        last5Years: year10AvgRevenue,
        last10Years: year5AvgRevenue,
        lastAll: year1AvgRevenue,
    }
    
}