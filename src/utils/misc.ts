
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
    return year * 4 + quarter;
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

/**
 * @param fromTime 
 * @param toTime 
 * @param data 
 * @returns 
 */
export function getAverageS(fromTime: number | undefined, toTime: number | undefined, data: Array<DtPoint<number | null>>) : undefined | number {
    let previousTime = fromTime;

    let total = 0;
    let count = 0;



    for (const dataPoint of data) {
        previousTime = dataPoint.time;

        if (fromTime && dataPoint.time < fromTime) continue;
        if (toTime && dataPoint.time > toTime) continue;

        if (dataPoint.data !== null) {
            total += dataPoint.data;
            count++;
        }
    }

    return total/count;


}