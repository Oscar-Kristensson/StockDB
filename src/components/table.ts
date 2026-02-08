import { CustomElementInterface } from "./base";
import { CustomContainer } from "./container";



export class CustomTable implements CustomElementInterface {
    container: HTMLDivElement;
    table: HTMLTableElement;
    tableBody: HTMLTableSectionElement;
    tableHead: HTMLTableSectionElement;

    width: Number;

    constructor(parent: HTMLElement | CustomContainer, className:string, width:Number = 1) {
        this.container = document.createElement("div");
        this.container.className = "customTable";
        this.container.classList.add(className);

        this.table = document.createElement("table");

        this.container.appendChild(this.table);

        parent.appendChild(this.container);

        this.width = width;

        this.tableHead = document.createElement("thead");
        this.table.appendChild(this.tableHead);
        this.tableBody = document.createElement("tbody");
        this.table.appendChild(this.tableBody);

    }


    addRow(row: Array<CustomElementInterface>, header: boolean = false) {
        if (row.length !== this.width) {
            console.error("The array length does not match the tables width");
            return;
        }

        console.log("Adding row");

        const tableRow = document.createElement("tr");

        if (header) {
            tableRow.classList.add("header");
        }
        

        row.forEach(element => {
            const tableElement = document.createElement(header ? "th" : "td");
            tableElement.appendChild(element.getTopMostHTMLContainer());
            tableRow.appendChild(tableElement);
        });
        (header ? this.tableHead : this.tableBody).appendChild(tableRow);


    }



    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.error("Table element can not append a child", node.toString());        
    }

}