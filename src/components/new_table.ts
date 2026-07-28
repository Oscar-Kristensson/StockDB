import { formatNumberBody, formatWithPrefix } from "../utils";

// One column definition (the header row)
export interface TableColumn {
  key: string;      // e.g. "latest", "5y", "10y", "all"
  label: string;    // e.g. "Latest", "5 years", "10 years", "All"
}

// A single cell's value + loading state
export interface TableCell {
  value: string | number | null; // null/undefined until loaded
  loaded: boolean;                // false => render "unloaded" placeholder
}

// A row: label + one cell per column key
export interface TableRow {
  label: string;                 // e.g. "Return on equity"
  values: Record<string, TableCell>; // keyed by column.key
}

// The whole table
export interface CustomTableData {
  columns: TableColumn[];
  rows: TableRow[];
}

export function renderOverviewTable(data: CustomTableData, classNames: string = ""): string {
  const headerCells = [
    `<th><div class="labelElement"></div></th>`,
    ...data.columns.map(
      (col) => `<th><div class="labelElement">${escapeHtml(col.label)}</div></th>`
    ),
  ].join("");

  const bodyRows = data.rows
    .map((row) => {
      const cells = data.columns
        .map((col) => {
          const cell = row.values[col.key];
          const cls = cell.loaded ? "labelElement" : "labelElement unloaded";
          const text = cell.loaded ? formatValue(cell.value) : "-";
          return `<td><div class="${cls}">${text}</div></td>`;
        })
        .join("");
      return `<tr><td><div class="labelElement">${escapeHtml(row.label)}</div></td>${cells}</tr>`;
    })
    .join("");

  return `<div class="customTable ${classNames}"><table><thead><tr class="header">${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
}

function formatValue(value: string | number | null): string {
    if (typeof value === "number") {
        value = formatWithPrefix(value);
    }
    return value == null ? "-" : String(value);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]!));
}