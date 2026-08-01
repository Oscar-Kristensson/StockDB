
const loadedCSSFiles: Array<string> = [];


// NOTE: Everything in this file should be in the utils namespace
export function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    parent?: HTMLElement,
    classNames: string[] = [],
): HTMLElementTagNameMap[K] {

    const element = document.createElement(tagName);

    classNames.forEach(className => {
        element.classList.add(className);
    });

    parent?.appendChild(element);

    return element;
}


export function pascalToWords(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}






export function loadCSS(href: string) {
    if (href in loadedCSSFiles) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    loadedCSSFiles.push(href);
}




export function assert(condition: boolean, errorMsg: string) {
    if (!condition)
        throw new Error(errorMsg);
}



export function printError(error: unknown, fn: Function) {
    console.error(`The function db.${fn.name} returned the following error: ${error}`);
 
}


export function averageO<T>(objects: Array<T>, func: ((object: T) => number)) {
    let total = 0;

    objects.forEach(object => {
        total += func(object);
    })

    return total/objects.length;
}


export function average(numbers: Array<number>) {
    let total = 0;
    numbers.forEach(number => {
        total += number;
    });

    return total / numbers.length;
}

export function calcTotalPeriod(year: number, quarter: number) {
    // NOTE: This changed recently from 4 -> 5 to accommodate the yearly reports
    return year * 5 + quarter;
}

/**
 * A value at a point in time
 */
export class DtPoint<T> {
    constructor(
        public time: number,
        public data: T,
    ) {}

}

type AverageInfo = {
    average: number,
    count: number
}

/**
 * @param fromTime 
 * @param toTime 
 * @param data 
 * @returns 
 */
export function getAverageS(fromTime: number | undefined, toTime: number | undefined, data: Array<DtPoint<number | null>>) : undefined | AverageInfo {
    //let previousTime: number; // = fromTime;

    let total = 0;
    let count = 0;



    for (const dataPoint of data) {
        //previousTime = dataPoint.time;

        if (fromTime && dataPoint.time < fromTime) continue;
        if (toTime && dataPoint.time > toTime) continue;

        if (dataPoint.data === null) {
            return undefined;
        }

       
        total += dataPoint.data;
        count++;
    
    }

    return {
        average: total/count,
        count: count,
    };


}


export function getCurrentQuarter(date: Date = new Date()): number {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  return Math.floor(month / 3) + 1;
}




/**
 * NOTE: This function should not be used since it does not open a file dialog or give the user any feedback 
 * @param data 
 * @param fileName 
 */
export function saveFile(data: string, fileName = "test.csv"){


    const blob = new Blob([data], {type: "text/csv;charset=utf-8;"});

    const downloadLink = document.createElement("a");

    downloadLink.download = fileName;

    downloadLink.href = window.URL.createObjectURL(blob);

    document.body.appendChild(downloadLink)

    downloadLink.click()

    document.body.removeChild(downloadLink)


}




export function formatWithPrefix(num: number): string {
  if (num === 0) return "0";

  const prefixes = [
    { value: 1e12, symbol: "T" },
    { value: 1e9,  symbol: "B" }, // Use "B" or "b" based on your preference
    { value: 1e6,  symbol: "M" },
    { value: 1e3,  symbol: "k" },
  ];

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  for (const { value, symbol } of prefixes) {
    if (absNum >= value) {
      const scaled = num / value;
      // Convert to 4 significant digits
      const formatted = Number(scaled.toPrecision(4)).toString();
      
      // Replace decimal point with space if it's a whole number, 
      // or format appropriately
      return `${sign}${formatNumberBody(formatted)} ${symbol}`;
    }
  }

  // Fallback for numbers smaller than 1000
  return `${sign}${formatNumberBody(Number(num.toPrecision(4)).toString())}`;
}

/**
 * Helper to match your exact spacing style (e.g., "1 300" instead of "1300")
 */
export function formatNumberBody(numStr: string): string {
  const [integerPart, decimalPart] = numStr.split(".");
  
  // Add spaces as thousand separators for the integer portion
  const spacedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  return decimalPart ? `${spacedInteger}.${decimalPart}` : spacedInteger;
}



export function isInRange(value: number, min: number, max: number) {
    return min <= value && value <= max;
}