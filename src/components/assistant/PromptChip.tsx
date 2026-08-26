export default function PromptChip({ label, onClick }: { label: string; onClick: (label: string) => void }) {
  return (
    <button type="button" className="prompt-chip" onClick={() => onClick(label)}>
      {label}
    </button>
  );
}
