const boardWidth = 1024;
const boardHeight = 768;

const wires = [
    { x: boardWidth / 5 }, // first wire position
    { x: (2 * boardWidth) / 5 }, // second wire position
    { x: (3 * boardWidth) / 5 }, // third wire position
    { x: (4 * boardWidth) / 5 } // fourth wire position
];

const bugWidth = 64; // bug width
const bugHeight = 38; // bug height
const bugY = (6 * boardHeight) / 8;

const jumpHeight = 100;

export {boardWidth,
    boardHeight,
    wires,
    bugHeight,
    bugWidth,
    bugY,
    jumpHeight
}