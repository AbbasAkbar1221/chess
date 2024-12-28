import React, { useState } from "react";
import blackRook from "../assets/black_rook.png";
import blackKnight from "../assets/black_knight.png";
import blackBishop from "../assets/black_bishop.png";
import blackQueen from "../assets/black_queen.png";
import blackKing from "../assets/black_king.png";
import blackPawn from "../assets/black_pawn.png";
import whiteRook from "../assets/white_rook.png";
import whiteKnight from "../assets/white_knight.png";
import whiteBishop from "../assets/white_bishop.png";
import whiteQueen from "../assets/white_queen.png";
import whiteKing from "../assets/white_king.png";
import whitePawn from "../assets/white_pawn.png";

const pieceImages = {
  black: {
    rook: blackRook,
    knight: blackKnight,
    bishop: blackBishop,
    queen: blackQueen,
    king: blackKing,
    pawn: blackPawn,
  },
  white: {
    rook: whiteRook,
    knight: whiteKnight,
    bishop: whiteBishop,
    queen: whiteQueen,
    king: whiteKing,
    pawn: whitePawn,
  },
};

const initialChessBoard = [
  [
    { color: "black", type: "rook" },
    { color: "black", type: "knight" },
    { color: "black", type: "bishop" },
    { color: "black", type: "queen" },
    { color: "black", type: "king" },
    { color: "black", type: "bishop" },
    { color: "black", type: "knight" },
    { color: "black", type: "rook" },
  ],
  Array(8).fill({ color: "black", type: "pawn" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ color: "white", type: "pawn" }),
  [
    { color: "white", type: "rook" },
    { color: "white", type: "knight" },
    { color: "white", type: "bishop" },
    { color: "white", type: "queen" },
    { color: "white", type: "king" },
    { color: "white", type: "bishop" },
    { color: "white", type: "knight" },
    { color: "white", type: "rook" },
  ],
];

const ChessGame = () => {
  let [chessBoard, setChessBoard] = useState(initialChessBoard);
  let [turn, setTurn] = useState("white");
  let [selectedPiece, setSelectedPiece] = useState(null);
  let [possibleMoves, setPossibleMoves] = useState([])

  const getSquareColor = (row, col) => {
    return (row + col) % 2 === 0 ? "bg-gray-200" : "bg-gray-800";
  };

  const handleSquareClick = (row, col) => {
    const piece = chessBoard[row][col];

    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;

      if (isValidMove(selectedRow, selectedCol, row, col)) {
        const newChessBoard = chessBoard.map((r, rowIdx) =>
          r.map((c, colIdx) => {
            if (rowIdx === row && colIdx === col) {
              return chessBoard[selectedRow][selectedCol];
            }
            if (rowIdx === selectedRow && colIdx === selectedCol) {
              return null;
            }
            return c;
          })
        );

        setChessBoard(newChessBoard);
        setTurn(turn === "white" ? "black" : "white");
        setSelectedPiece(null);
        setPossibleMoves([])
      } else {
        alert("Invalid move!");
        setSelectedPiece(null);
        setPossibleMoves([])
      }
    } else {
      if (piece && piece.color === turn) {
        setSelectedPiece([row, col]);

        let moves = [];

        for(let i=0 ;i<8; i++){
          for(let j=0; j<8; j++){
            if(isValidMove(row, col, i, j)){
              moves.push([i, j]);
            }
          }
        }

        setPossibleMoves(moves)
      } else {
        alert("Not your turn or invalid selection!");
      }
    }
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = chessBoard[fromRow][fromCol];

    if (!piece) {
      return false;
    }

    if (fromRow === toRow && fromCol === toCol) return false;

    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

    const isWhite = piece.color === "white";

    if ((isWhite && turn !== "white") || (!isWhite && turn !== "black")) {
      return false;
    }

    if (piece.type === "pawn") {
      return isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite);
    }
    if (piece.type === "rook") {
      return isValidRookMove(fromRow, fromCol, toRow, toCol, isWhite);
    }
    if (piece.type === "knight") {
      return isValidKnightMove(fromRow, fromCol, toRow, toCol, isWhite);
    }
    if (piece.type === "bishop") {
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, isWhite);
    }
    if (piece.type === "queen") {
      return isValidQueenMove(fromRow, fromCol, toRow, toCol, isWhite);
    }
    if (piece.type === "king") {
      return isValidKingMove(fromRow, fromCol, toRow, toCol, isWhite);
    }

    return false;
  };

  const isValidPawnMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // one step forward
    if (
      toRow === fromRow + direction &&
      toCol === fromCol &&
      !chessBoard[toRow][toCol]
    ) {
      return true;
    }

    //two step forward
    if (
      fromRow === startRow &&
      toRow === fromRow + 2 * direction &&
      toCol === fromCol &&
      !chessBoard[toRow][toCol] &&
      !chessBoard[fromRow + direction][fromCol]
    ) {
      return true;
    }

    // one step diagonal
    if (
      toRow === fromRow + direction &&
      Math.abs(toCol - fromCol) === 1 &&
      chessBoard[toRow][toCol] &&
      chessBoard[toRow][toCol].color === (isWhite ? "black" : "white")
    ) {
      return true;
    }
    return false;
  };

  const isValidRookMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    if (fromRow !== toRow && fromCol !== toCol) {
      return false;
    }

    if (toRow === fromRow) {
      const step = fromCol > toCol ? -1 : 1;

      for (let i = fromCol + step; i !== toCol; i += step) {
        if (chessBoard[toRow][i]) {
          return false;
        }
      }
    } else {
      const step = fromRow > toRow ? -1 : 1;

      for (let i = fromRow + step; i !== toRow; i += step) {
        if (chessBoard[i][toCol]) {
          return false;
        }
      }
    }

    const targetPiece = chessBoard[toRow][toCol];

    if (targetPiece && targetPiece.color === (isWhite ? "white" : "black")) {
      return false;
    }

    return true;
  };
  const isValidBishopMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    // diagonal move
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
      return false;
    }

    let rowStep = toRow > fromRow ? 1 : -1;
    let colStep = toCol > fromCol ? 1 : -1;

    let currRow = fromRow + rowStep;
    let currCol = fromCol + colStep;

    while (currRow !== toRow && currCol !== toCol) {
      if (chessBoard[currRow][currCol]) {
        return false;
      }
      currRow += rowStep;
      currCol += colStep;
    }

    const targetPiece = chessBoard[toRow][toCol];

    if (targetPiece && targetPiece.color === (isWhite ? "white" : "black")) {
      return false;
    }

    return true;
  };

  const isValidKnightMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    if (
      !((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))
    ) {
      return false;
    }

    const targetPiece = chessBoard[toRow][toCol];

    if (targetPiece && targetPiece.color === (isWhite ? "white" : "black")) {
      return false;
    }

    return true;
  };
  const isValidQueenMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if (!(rowDiff === colDiff || fromRow === toRow || fromCol === toCol)) {
      return false;
    }

    let rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    let colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currRow = fromRow + rowStep;
    let currCol = fromCol + colStep;

    while (currRow !== toRow || currCol !== toCol) {
      if (chessBoard[currRow][currCol]) {
        return false;
      }
      currRow += rowStep;
      currCol += colStep;
    }

    const targetPiece = chessBoard[toRow][toCol];

    if (targetPiece && targetPiece.color === (isWhite ? "white" : "black")) {
      return false;
    }

    return true;
  };

  
  const isValidKingMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    if (rowDiff > 1 || colDiff > 1) {
      return false;
    }

    const targetPiece = chessBoard[toRow][toCol];

    if (targetPiece && targetPiece.color === (isWhite ? "white" : "black")) {
      return false;
    }

    return true;
  };

  
return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage:'url(/chess.jpg)' }}
      
    ></div>
    <div className="grid grid-cols-8 grid-rows-8 w-[480px] h-[480px] border-4 border-gray-800">
      {chessBoard.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isHighlighted = possibleMoves.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-full h-full relative ${getSquareColor(
                rowIndex,
                colIndex
              )} border border-gray-800 `}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {isHighlighted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-900 rounded-full w-4 h-4"></div>
              </div>
            )}
              {piece && (
                <img
                  src={pieceImages[piece.color][piece.type]}
                  alt="chess piece"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          );
        })
      )}
    </div>
    <div
      className={`mt-4 text-lg font-semibold px-4 py-2 rounded z-20 ${
        turn === "white" ? "bg-gray-200 text-black" : "bg-black text-white"
      }`}
    >
      {`Turn: ${turn.charAt(0).toUpperCase() + turn.slice(1)}`}
    </div>
  </div>
);
};

export default ChessGame;
