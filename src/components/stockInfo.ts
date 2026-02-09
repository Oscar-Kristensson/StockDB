import { StockInfo } from "../stocks.ts";
import { CustomElementInterface } from "./base.ts";

class StatElement {
    container: HTMLDivElement;
    nameLabel: HTMLDivElement;
    statLabel: HTMLDivElement;
    
    constructor(parent: HTMLDivElement, statName: string, className:string, statValue: string | undefined) {
        this.container = document.createElement("div");
        this.container.className = className;
        this.container.classList.add("stat");

        this.nameLabel = document.createElement("div");
        this.nameLabel.className = "statName";
        this.nameLabel.innerText = statName;
        
        this.statLabel = document.createElement("div");
        this.statLabel.className = "statLabel";

        if (statValue)
            this.setValue(statValue);

        this.container.appendChild(this.nameLabel);
        this.container.appendChild(this.statLabel);

        parent.appendChild(this.container);

    }

    setValue(value: string) {
        this.statLabel.innerText = value;

    }
}

const statTypes = ["id", "ticker", "exchange", "sector", "industry", "currency"];

export class CustomStockInfo implements CustomElementInterface {
    container: HTMLDivElement;
    stockName: HTMLDivElement;
    statContainer: HTMLDivElement;
    statElements: Array<StatElement>;

    constructor(parent: HTMLElement, className: string = "") {
        this.container = document.createElement("div");
        this.container.className = "customStockInfo";
        
        if (className) {
            this.container.classList.add(className);
        }

        this.stockName = document.createElement("div");
        this.stockName.className = "stockName";
        this.container.appendChild(this.stockName);

        this.statContainer = document.createElement("div");
        this.statContainer.className = "statContainer";

        this.statElements = [];

        statTypes.forEach(stat => {
            const name = stat[0].toUpperCase() + stat.slice(1) + ":";
            this.statElements.push(new StatElement(this.statContainer, name, stat, undefined));
        })

        this.container.appendChild(this.statContainer);


        parent.appendChild(this.container);

    }

    setStock(stock: StockInfo) {
        this.stockName.innerText = stock.name;
        this.statElements[0].setValue(stock.id.toString());
        this.statElements[1].setValue(stock.ticker.toString());
        this.statElements[2].setValue(stock.exchange.toString());
        this.statElements[3].setValue(stock.sector === null ? "Unkown" : stock.sector.toString());
        this.statElements[4].setValue(stock.industry === null ? "Unkown" : stock.industry.toString());
        this.statElements[5].setValue(stock.currency.toString());

    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("CustomStockInfo can not have children", node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }




} 