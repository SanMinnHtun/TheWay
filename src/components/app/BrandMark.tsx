import rocket from "../../assets/the-way-rocket.svg";

export default function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className={`the-way-brand-mark the-way-brand-mark--${size}`} aria-hidden="true">
      <img src={rocket} alt="" />
    </span>
  );
}
