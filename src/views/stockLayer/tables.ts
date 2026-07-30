import { CustomTableRow } from "../../components/row";
import { CustomLabelElement } from "./customLabel";
import { TableColumn, TableCell, TableRow } from "../../components/new_table";
import * as utils from "../../utils";
import * as economy from "../../economy"

import { CustomTableData } from "../../components/new_table";

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
            this.element.update("-");
            this.element.setloaded(false);
        } else {
            this.element.setloaded(true);
            let str: string = String(value);
            if (typeof value === "number")
                str = value.toFixed(2);
            this.element.update(str);
        }

    }

    

    
}

export class TableRowData {
    latest: TableRowStruct<number | undefined>;
    last5Years: TableRowStruct<number | undefined>;
    last10Years: TableRowStruct<number | undefined>;
    lastAll: TableRowStruct<number | undefined>;

    constructor(
    ) {
        this.latest = new TableRowStruct(undefined);
        this.last5Years = new TableRowStruct(undefined);
        this.last10Years = new TableRowStruct(undefined);
        this.lastAll = new TableRowStruct(undefined);
    }

    addTo(container: HTMLDivElement) {
        container.appendChild(this.latest.tableElement);
        container.appendChild(this.last5Years.tableElement);
        container.appendChild(this.last10Years.tableElement);
        container.appendChild(this.lastAll.tableElement);
    }

    setData(
        latest: number | undefined,    
        last5Years: number | undefined,
        last10Years: number | undefined,
        lastAll: number | undefined,

    ) {
        this.latest.update(latest);
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
            data.last5Years,
            data.last10Years,
            data.lastAll
        )
    }

    setDataStockStat(stat: economy.StockStat<number | undefined>){
        this.setData(
            stat.previous,
            stat.fiveYear,
            stat.tenYear,
            stat.allYears,
        )
    }


    

}


type MetricKey = keyof Omit<economy.MetricAverages, "sampleSize">;

const METRIC_ROWS: { key: MetricKey; label: string }[] = [
  { key: "returnOnEquity", label: "Return on equity" },
  { key: "pricePerEquity", label: "Price per equity" },
  { key: "equityPerShare", label: "Equity per share {currency}" },
  { key: "earningsPerShare", label: "Earnings per share {currency}" },
  { key: "pricePerEarnings", label: "P/e ratio" },
  { key: "sharePrice", label: "Shares price {currency}" },
  { key: "dividend", label: "Dividend" },
];

const COLUMNS: TableColumn[] = [
  { key: "latest", label: "Latest" },
  { key: "5y", label: "5 years" },
  { key: "10y", label: "10 years" },
  { key: "all", label: "All" },
];

export function buildOverviewTable(summary: economy.StockMetricsSummary): CustomTableData {
  const periodByColumnKey: Record<string, economy.MetricAverages | null> = {
    latest: summary.latest,
    "5y": summary.last5Years,
    "10y": summary.last10Years,
    all: summary.allTime,
  };

  const rows: TableRow[] = METRIC_ROWS.map(({ key, label }) => {
    const values: Record<string, TableCell> = {};

    for (const col of COLUMNS) {
      const period = periodByColumnKey[col.key];
      const raw = period ? period[key] : null;

      values[col.key] = {
        value: raw,
        loaded: raw != null, // null -> stays "unloaded", matches your placeholder rows
      };
    }

    return { label, values };
  });

  return { columns: COLUMNS, rows };
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