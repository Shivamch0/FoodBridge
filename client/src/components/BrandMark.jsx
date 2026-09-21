import { HandHeart } from "lucide-react";

export function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="brand-mark">
        <HandHeart size={21} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="font-display text-[1.45rem] tracking-[-0.04em]">
          FoodBridge
        </span>
      )}
    </div>
  );
}
