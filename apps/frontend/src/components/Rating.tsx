import { Star } from "lucide-react"

const STAR_VALUES = [1, 2, 3, 4, 5] as const

type Props = {
  value: number
  showNumber?: boolean
}

const Rating = ({ value, showNumber = true }: Props) => {
  return (
    <div className="flex items-center" role="img" aria-label={`評価 ${value} / 5`}>
      {STAR_VALUES.map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= value ? "text-amber-500 fill-amber-500" : "text-stone-300"}`}
        />
      ))}
      {showNumber && <span className="ml-2 text-sm">({value})</span>}
    </div>
  )
}

export default Rating
