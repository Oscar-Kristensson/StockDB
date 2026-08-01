import { QuarterlyReport } from "../db";


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

function getLatestQuarterlyReport(reports: Array<QuarterlyReport>, period: PeriodType) {
    return reports
        .filter(report => {
            switch(period) {
                case "Yearly":
                    return report.fiscal_quarter == 0;
                case "Quarterly":
                    return report.fiscal_quarter != 0;
            }
        })
        .sort((a, b) => b.totalPeriod - a.totalPeriod)[0];

}

function averageMetrics(reports: QuarterlyReport[]): MetricAverages {
  const metrics = reports.map(computeDerivedMetrics);

  return {
    returnOnEquity: average(metrics.map((m) => m.returnOnEquity)),
    pricePerEquity: average(metrics.map((m) => m.pricePerEquity)),
    equityPerShare: average(metrics.map((m) => m.equityPerShare)),
    earningsPerShare: average(metrics.map((m) => m.earningsPerShare)),
    pricePerEarnings: average(metrics.map((m) => m.pricePerEarnings)),
    sharePrice: average(metrics.map((m) => m.sharePrice)),
    dividend: average(metrics.map((m) => m.dividend)),
    sampleSize: reports.length,
  };
}

/**
 * Computes average metrics over the last 5 years, last 10 years, and all time.
 * @param allReports Full list of QuarterlyReport for a stock.
 * @param periodType "yearly" -> only fiscal_quarter === 0 reports are considered.
 *                   "quarterly" -> only fiscal_quarter !== 0 reports are considered.
 */
export function computeStockMetricsSummary(
  allReports: QuarterlyReport[],
  periodType: PeriodType
): StockMetricsSummary {
  const filtered = allReports.filter((r) =>
    periodType === "Yearly" ? r.fiscal_quarter === 0 : r.fiscal_quarter !== 0
  );

  // Distinct fiscal years present, descending (most recent first).
  const distinctYears = Array.from(new Set(filtered.map((r) => r.fiscal_year))).sort(
    (a, b) => b - a
  );

  const last5YearSet = new Set(distinctYears.slice(0, 5));
  const last10YearSet = new Set(distinctYears.slice(0, 10));

  const last5Reports = filtered.filter((r) => last5YearSet.has(r.fiscal_year));
  const last10Reports = filtered.filter((r) => last10YearSet.has(r.fiscal_year));

  const latestReport = getLatestQuarterlyReport(allReports, periodType);


  return {
    latest: averageMetrics([latestReport]),
    last5Years: averageMetrics(last5Reports),
    last10Years: averageMetrics(last10Reports),
    allTime: averageMetrics(filtered),
  };
}