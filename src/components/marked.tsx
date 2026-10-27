// Renders copy, turning any [BRACKETED NOTE] into a visible "to confirm" chip
// so unconfirmed facts can't slip onto the live site unnoticed.
export function Marked({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <span key={i} className="to-confirm">
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
