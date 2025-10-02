"use client"

interface TileProps {
  value: number
}

const tileColors: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-transparent", text: "text-transparent" },
  2: { bg: "bg-[#D3FFB2]", text: "text-[#004C78]" },
  4: { bg: "bg-[#BFFF3F]", text: "text-[#004C78]" },
  8: { bg: "bg-[#49FF9E]", text: "text-[#004C78]" },
  16: { bg: "bg-[#216E3E]", text: "text-white" },
  32: { bg: "bg-[#72E0FF]", text: "text-[#004C78]" },
  64: { bg: "bg-[#004C78]", text: "text-white" },
  128: { bg: "bg-[#49FF9E]", text: "text-[#004C78]" },
  256: { bg: "bg-[#216E3E]", text: "text-white" },
  512: { bg: "bg-[#72E0FF]", text: "text-[#004C78]" },
  1024: { bg: "bg-[#004C78]", text: "text-[#49FF9E]" },
  2048: { bg: "bg-[#216E3E]", text: "text-[#BFFF3F]" },
}

export function Tile({ value }: TileProps) {
  const colors = tileColors[value] || tileColors[2048]
  const fontSize = value >= 1024 ? "text-3xl" : value >= 128 ? "text-4xl" : "text-5xl"

  return (
    <div
      className={`
        aspect-square rounded-xl flex items-center justify-center font-bold
        transition-all duration-150 ease-in-out
        ${colors.bg} ${colors.text} ${fontSize}
        ${value !== 0 ? "scale-100 shadow-md" : "scale-95"}
      `}
    >
      {value !== 0 && value}
    </div>
  )
}
