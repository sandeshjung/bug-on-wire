const setupCanvas = (boardHeight, boardWidth) => {
    const board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    const context = board.getContext("2d");
    return { board, context };
};

export default setupCanvas;
