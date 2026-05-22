import * as utils from "../utils"


export class CustomTableRow {
    container: HTMLTableRowElement;
    constructor() {
        this.container = utils.createElement("tr", undefined, []);
    }

    get rows() : number | undefined {
        return this.container.childNodes.length;
    }

    deleted() {
        this.container.remove();
    }
}