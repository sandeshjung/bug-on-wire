import { wires } from "./constant.js";

export default class Wire {
    constructor(context, board){
        this.context = context;
        this.board = board;
    }

    drawWires(){
    this.context.fillStyle = "#000";
    for (let wire of wires) {
        this.context.fillRect(wire.x - 1.5, 0, 3, this.board.height);
    }
    }
}