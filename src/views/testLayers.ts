import { AppLayer } from "../appLayer.ts";




class FirstLayer extends AppLayer {
    constructor() {
        super("firstLayer", "assets/icons/StockIcon.svg");

    }
}



export const firstLayer = new FirstLayer();