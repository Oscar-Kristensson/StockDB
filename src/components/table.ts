import { CustomElementInterface } from "./base";
import { CustomContainer } from "./container";

export class CustomTableElement {
    html: HTMLTableCellElement;
    constructor(content: HTMLElement, className: string = "") {
        this.html = document.createElement("td");

        if (className !== "")
           this.html.className = className;

        this.html.appendChild(content);
    }

    static fromStringList(data: Array<string>) {
        const list: Array<CustomTableElement> = [];
        data.forEach(data => {
            list.push(CustomTableElement.fromString(data));
        })

        return list;
    }

    static fromString(string: string) {
        const text = document.createElement("div");
        text.innerText = string;
        return new CustomTableElement(text)
        
    }

    
}


export class CustomTableRow {
    tableRow: HTMLTableRowElement;
    size: Number;
    header: boolean;
    
    constructor(data: Array<CustomTableElement>, header:boolean = false) {
        this.tableRow = document.createElement("tr");
        this.header = header;
        this.size = data.length;

    }

}


export class CustomTable implements CustomElementInterface {
    container: HTMLDivElement;
    table: HTMLTableElement;
    tableBody: HTMLTableSectionElement;
    tableHead: HTMLTableSectionElement;

    rows: Array<CustomTableRow>;
    width: Number;

    constructor(parent: HTMLElement | CustomContainer, className:string, width:Number = 1) {
        this.container = document.createElement("div");
        this.container.className = "customTable";
        this.container.classList.add(className);

        this.table = document.createElement("table");

        this.container.appendChild(this.table);

        parent.appendChild(this.container);

        this.rows = [];
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