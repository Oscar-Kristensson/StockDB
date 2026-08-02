import { QuarterlyReport } from "../db";
import { CompleteQuarterlyData } from "./structs";


export type PeriodType = "Yearly" | "Quarterly";

export interface MetricAverages {
    returnOnEquity: number | null;
    pricePerEquity: number | null;
    equityPerShare: number | null;
    earningsPerShare: number | null;
    pricePerEarnings: number | null;
    sharePrice: number | null;
    dividend: number | null;
    sampleSize: number; // number of reports actually included
}

export interface StockMetricsSummary {
    latest: MetricAverages;
    last5Years: MetricAverages;
    last10Years: MetricAverages;
    allTime: MetricAverages;
}

export const derivedMetricKeys: (keyof DerivedMetrics)[] = [
    'returnOnEquity',
    'equityPerShare',
    'pricePerEquity',
    'earningsPerShare',
    'pricePerEarnings',
    'sharePrice',
    'dividend',
];


export const derivedMetricLabels: Array<string> = [
    'Return on equity [%]',
    'Equity per share',
    'Price per equity [%]',
    'Earnings per share',
    'Price per earnings',
    'Share price',
    'Dividend',
]

/** Per-report derived metrics. Any input of null/0-denominator yields null for that field. */
export interface DerivedMetrics {
    returnOnEquity: number | null;
    equityPerShare: number | null;
    pricePerEquity: number | null;
    earningsPerShare: number | null;
    pricePerEarnings: number | null;
    sharePrice: number | null;
    dividend: number | null;
}

function safeDiv(a: number | null, b: number | null, asPercentage: boolean = false): number | null {
    if (a === null || b === null || b === 0) return null;
    return asPercentage ? a / b * 100 : a / b;
}

export function computeDerivedMetrics(r: QuarterlyReport): DerivedMetrics {
    const equityPerShare = safeDiv(r.total_shareholders_equity, r.shares_outstanding);
    const earningsPerShare = safeDiv(r.net_income, r.shares_outstanding);
    const returnOnEquity = safeDiv(r.net_income, r.total_shareholders_equity, true);
    const pricePerEquity = safeDiv(r.share_price, equityPerShare, true);
    const pricePerEarnings = safeDiv(r.share_price, earningsPerShare);

    return {
        returnOnEquity,
        equityPerShare,
        pricePerEquity,
        earningsPerShare,
        pricePerEarnings,
        sharePrice: r.share_price,
        dividend: r.dividend,
    };
}

/** Averages a list of (possibly null) numbers, ignoring nulls. Returns null if no valid values. */
function average(values: Array<number | null>): number | null {
    const valid = values.filter((v): v is number => v !== null && !Number.isNaN(v));
    if (valid.length === 0) return null;
    return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}



function averageMetrics(metrics: DerivedMetrics[]): MetricAverages {

    return {
        returnOnEquity: average(metrics.map((m) => m.returnOnEquity)),
        pricePerEquity: average(metrics.map((m) => m.pricePerEquity)),
        equityPerShare: average(metrics.map((m) => m.equityPerShare)),
        earningsPerShare: average(metrics.map((m) => m.earningsPerShare)),
        pricePerEarnings: average(metrics.map((m) => m.pricePerEarnings)),
        sharePrice: average(metrics.map((m) => m.sharePrice)),
        dividend: average(metrics.map((m) => m.dividend)),
        sampleSize: metrics.length,
    };
}

/**
 * Computes average metrics over the last 5 years, last 10 years, and all time.
 * @param allReports Full list of QuarterlyReport for a stock.
 * @param periodType "yearly" -> only fiscal_quarter === 0 reports are considered.
 *                   "quarterly" -> only fiscal_quarter !== 0 reports are considered.
 */
export function computeStockMetricsSummary(
    allReports: CompleteQuarterlyData[],
    periodType: PeriodType
): StockMetricsSummary {
    // 1. Single pass to filter and pre-calculate metrics once
    const filteredWithMetrics = allReports
    .filter((d) => (periodType === "Yearly" ? d.report.fiscal_quarter === 0 : d.report.fiscal_quarter !== 0));

    if (filteredWithMetrics.length === 0) {
        // Return empty state or throw based on app structure
    }

    const maxYear = Math.max(...filteredWithMetrics.map((r) => r.report.fiscal_year));


    // Filter by calendar year range relative to the latest report
    // (e.g., if maxYear is 2025, last 5 years covers 2021 through 2025)
    const last5Reports = filteredWithMetrics
        .filter((r) => r.report.fiscal_year > maxYear - 5)
        .map((r) => r.derived);
    const last10Reports = filteredWithMetrics
        .filter((r) => r.report.fiscal_year > maxYear - 10)
        .map((r) => r.derived);

    /** Array containing only the latest report */
    const latestReport = [] 
    const possible_report = filteredWithMetrics
        .find((r) => r.report.fiscal_year === maxYear)?.derived
    if (possible_report) latestReport.push(possible_report); 


    return {
        latest: averageMetrics(latestReport),
        last5Years: averageMetrics(last5Reports),
        last10Years: averageMetrics(last10Reports),
        allTime: averageMetrics(filteredWithMetrics.map(r => r.derived)),
    };
}