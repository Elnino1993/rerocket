"use client"

import { useState, useCallback } from "react"

type Direction = "up" | "down" | "left" | "right"

const createEmptyBoard = (): number[][] => {
  return Array(4)
    .fill(0)
    .map(() => Array(4).fill(0))
}

const addRandomTile = (board: number[][], direction?: Direction): number[][] => {
  const newBoard = board.map((row) => [...row])
  const emptyCells: [number, number][] = []

  // If direction is provided, only add tiles on the opposite edge
  if (direction) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          // Check if cell is on the opposite edge based on direction
          const isValidCell =
            (direction === "left" && j === 3) || // Right edge
            (direction === "right" && j === 0) || // Left edge
            (direction === "up" && i === 3) || // Bottom edge
            (direction === "down" && i === 0) // Top edge

          if (isValidCell) {
            emptyCells.push([i, j])
          }
        }
      }
    }
  } else {
    // No direction specified (initial game setup), use any empty cell
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }
  }

  if (emptyCells.length > 0) {
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4
  }

  return newBoard
}

const rotateBoard = (board: number[][]): number[][] => {
  const newBoard = createEmptyBoard()
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newBoard[j][3 - i] = board[i][j]
    }
  }
  return newBoard
}

const moveLeft = (board: number[][]): { board: number[][]; score: number; moved: boolean } => {
  let score = 0
  let moved = false
  const newBoard = board.map((row) => {
    const filtered = row.filter((val) => val !== 0)
    const merged: number[] = []
    let skip = false

    for (let i = 0; i < filtered.length; i++) {
      if (skip) {
        skip = false
        continue
      }
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2)
        score += filtered[i] * 2
        skip = true
        moved = true
      } else {
        merged.push(filtered[i])
      }
    }

    while (merged.length < 4) {
      merged.push(0)
    }

    if (JSON.stringify(row) !== JSON.stringify(merged)) {
      moved = true
    }

    return merged
  })

  return { board: newBoard, score, moved }
}

export function useGame() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard())
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const initGame = useCallback(() => {
    let newBoard = createEmptyBoard()
    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    console.log("[v0] Game initialized")
  }, [])

  const checkGameOver = useCallback((currentBoard: number[][]): boolean => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) return false
        if (j < 3 && currentBoard[i][j] === currentBoard[i][j + 1]) return false
        if (i < 3 && currentBoard[i][j] === currentBoard[i + 1][j]) return false
      }
    }
    return true
  }, [])

  const checkWin = useCallback((currentBoard: number[][]): boolean => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 2048) return true
      }
    }
    return false
  }, [])

  const move = useCallback(
    (direction: Direction) => {
      if (gameOver || gameWon) return

      console.log("[v0] Moving:", direction)
      console.log("[v0] Board before move:", board)

      let currentBoard = board.map((row) => [...row])
      let rotations = 0

      switch (direction) {
        case "up":
          rotations = 3
          break
        case "right":
          rotations = 2
          break
        case "down":
          rotations = 1
          break
        case "left":
          rotations = 0
          break
      }

      // Rotate board to make the move direction "left"
      for (let i = 0; i < rotations; i++) {
        currentBoard = rotateBoard(currentBoard)
      }

      console.log("[v0] Board after rotation:", currentBoard)

      const { board: movedBoard, score: moveScore, moved } = moveLeft(currentBoard)

      console.log("[v0] Board after moveLeft:", movedBoard, "moved:", moved)

      // Rotate back to original orientation
      let finalBoard = movedBoard
      for (let i = 0; i < (4 - rotations) % 4; i++) {
        finalBoard = rotateBoard(finalBoard)
      }

      console.log("[v0] Board after rotating back:", finalBoard)

      if (moved) {
        const newBoard = addRandomTile(finalBoard, direction)
        setBoard(newBoard)
        setScore((prev) => prev + moveScore)

        if (checkWin(newBoard) && !gameWon) {
          setGameWon(true)
        }

        if (checkGameOver(newBoard)) {
          setGameOver(true)
        }
      }
    },
    [board, gameOver, gameWon, checkGameOver, checkWin],
  )

  return {
    board,
    score,
    gameOver,
    gameWon,
    initGame,
    move,
  }
}
