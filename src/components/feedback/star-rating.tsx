import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface StarRatingProps {
  value: number | null;
  onChange: (rating: number) => void;
}

export const StarRating = ({ value, onChange }: StarRatingProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-colors hover:text-yellow-400"
          aria-label={`${t("rate-stars")} ${star} ${t("stars")}`}
        >
          <Star
            size={32}
            className={
              value && value >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
};
