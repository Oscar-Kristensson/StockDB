// tabs/quarterly/reportList.ts
import * as utils from "../../utils";
import * as db from "../../db";
import { QuarterlyReport } from "../../db";
import { Stock } from "../../economy/stock.ts";
import { CustomButtonElement } from "../../components/button.ts";
import { CustomConfirmDialog } from "../../components/confirm.ts";
import { renderOverviewTable, CustomTableData, TableColumn, TableRow, TableCell } from "../../components/new_table.ts";
import { CustomTabs, CustomTab } from "../../components/tabs.ts";
import { AddRecordForm } from "./addQuarterly.ts";

export class QuarterlyReportList {
    container: HTMLElement;
    tableContainer: HTMLElement;

    stock: Stock | null = null;
    reports: QuarterlyReport[] = [];
    tabsSystem: CustomTabs | undefined;
    editQRTab: CustomTab | undefined;
    editQRForm: AddRecordForm | undefined;

    constructor(parent: HTMLElement) {
        this.container = utils.createElement("div", parent, ["quarterlyReportList"]);
        this.tableContainer = utils.createElement("div", this.container, ["tableWrapper"]);

        this.onDelete = this.onDelete.bind(this);
    }

    setStock(stock: Stock) {
        this.stock = stock;
        this.refresh();
    }

    refresh() {
        if (!this.stock) return;

        this.stock.getData()
            .then(reports => {
                this.reports = reports ?? [];
                this.render();
            })
            .catch(err => {
                console.error("Failed to load quarterly reports", err);
                this.tableContainer.innerHTML = "";
                const errorEl = utils.createElement("p", this.tableContainer, ["errorText"]);
                errorEl.textContent = "Failed to load reports";
            });
    }

    private buildTableData(): CustomTableData {
        const sorted = [...this.reports].sort((a, b) =>
            b.fiscal_year - a.fiscal_year || b.fiscal_quarter - a.fiscal_quarter
        );

        const columns: TableColumn[] = sorted.map(r => ({
            key: String(r.id),
            label: r.fiscal_quarter === 0 ? `${r.fiscal_year}` : `${r.fiscal_year} Q${r.fiscal_quarter}`,
        }));

        const rows: TableRow[] = QuarterlyReport.keys.map(([key, label]) => {
            const values: Record<string, TableCell> = {};
            sorted.forEach(r => {
                const raw = r[key] as number | null;
                values[String(r.id)] = {
                    value: raw,
                    loaded: raw !== null && raw !== undefined,
                };
            });
            return { label, values };
        });

        return { columns, rows };
    }

    private render() {
        if (this.reports.length === 0) {
            this.tableContainer.innerHTML = "";
            const emptyEl = utils.createElement("p", this.tableContainer, ["emptyState"]);
            emptyEl.textContent = "No quarterly reports for this stock yet.";
            return;
        }

        const data = this.buildTableData();
        this.tableContainer.innerHTML = renderOverviewTable(data, "databaseData");
        this.attachDeleteControls(data.columns);
    }

    private attachDeleteControls(columns: TableColumn[]) {
        const headerCells = this.tableContainer.querySelectorAll("thead tr.header th .labelElement");
        // headerCells[0] is the blank corner cell; columns map 1:1 from index 1 onward
        columns.forEach((col, i) => {
            const labelEl = headerCells[i + 1] as HTMLElement | undefined;
            if (!labelEl) return;

            const reportId = Number(col.key);
            new CustomButtonElement(labelEl, "", "icons/deleteIcon.svg", ["deleteReportBtn"], () => this.onDelete(reportId), true);
            new CustomButtonElement(labelEl, "", "icons/edit.svg", [], () => this.onEdit(reportId), true);
        });
    }

    private onDelete(reportId: number) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        const label = report.fiscal_quarter === 0
            ? `${report.fiscal_year} (yearly)`
            : `${report.fiscal_year} Q${report.fiscal_quarter}`;

        new CustomConfirmDialog(
            "Delete report?",
            `This will permanently delete the ${label} report. This cannot be undone.`,
            () => {
                db.deleteQuarterly(reportId)
                    .then(() => {
                        this.reports = this.reports.filter(r => r.id !== reportId);
                        this.render();
                    })
                    .catch(err => console.error("Failed to delete quarterly report", err));
            }
        );
    }


    private onEdit(reportId: number) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Connect this to the addQuarterly tab

        if (!this.tabsSystem) {
            console.error("Could not edit since the tabsSystem was not linked");
            return;
        }
        if (!this.editQRTab) {
            console.error("Could not edit since the editQRTab was not linked");
            return;
        }

        if (!this.editQRForm) {
            console.error("Could not edit since the editQRForm was not linked");
            return;
        }     
        
        
        this.tabsSystem.switchTab(this.editQRTab);
        this.editQRForm.openReport(report);

        
    }
}