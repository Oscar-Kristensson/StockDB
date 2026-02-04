import { AppLayer } from "../appLayer.ts";




class FirstLayer extends AppLayer {
    constructor() {
        super("firstLayer", "assets/icons/LogIcon.svg");

    }
}



export const firstLayer = new FirstLayer();
export const firstLayer2 = new FirstLayer();
export const firstLayer3 = new FirstLayer();