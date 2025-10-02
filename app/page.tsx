"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { GameBoard } from "@/components/game-board"
import { useGame } from "@/hooks/use-game"

export default function Home() {
  const { board, score, gameOver, gameWon, initGame, move } = useGame()
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score")
    if (saved) setBestScore(Number.parseInt(saved))
    initGame()
  }, [initGame])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("2048-best-score", score.toString())
    }
  }, [score, bestScore])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const direction = e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right"
        move(direction)
      }
    },
    [move],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/images/neura-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-6xl font-bold text-white">2048</h1>
            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-balance" style={{ color: "#49FF9E" }}>
            made specifically for the Neura Protocol community{" "}
            <a
              href="https://x.com/OxVentura"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "#49FF9E" }}
            >
              x.com/OxVentura
            </a>
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex gap-3">
            <div className="rounded-lg px-6 py-3 min-w-[100px]" style={{ backgroundColor: "#49FF9E" }}>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#004C78" }}>
                Score
              </div>
              <div className="text-2xl font-bold" style={{ color: "#004C78" }}>
                {score}
              </div>
            </div>
            <div className="rounded-lg px-6 py-3 min-w-[100px]" style={{ backgroundColor: "#49FF9E" }}>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#004C78" }}>
                Best
              </div>
              <div className="text-2xl font-bold" style={{ color: "#004C78" }}>
                {bestScore}
              </div>
            </div>
          </div>
          <Button
            onClick={initGame}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            New Game
          </Button>
        </div>

        <GameBoard board={board} />

        {(gameOver || gameWon) && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border-2 border-border rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 text-foreground">{gameWon ? "🎉 You Win!" : "😔 Game Over"}</h2>
              <p className="text-xl mb-2 text-foreground">Final Score</p>
              <p className="text-5xl font-bold mb-6 text-primary">{score}</p>
              <Button
                onClick={initGame}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
