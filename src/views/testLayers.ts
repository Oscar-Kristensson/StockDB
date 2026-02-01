import { AppLayer } from "../appLayer.ts";




class FirstLayer extends AppLayer {
    constructor() {
        super("firstLayer");

    }
}



export const firstLayer = new FirstLayer();