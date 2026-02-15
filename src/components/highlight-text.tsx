export interface HighlightTextProps {
  text: string;
  query: string;
}

export const HighlightText = ({ text, query }: HighlightTextProps) => {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const regex = new RegExp(
    `(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "ig"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={`${part}-${i}`} className="rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${i}`}>{part}</span>
        )
      )}
    </>
  );
};
