import galaxy from "../../assets/galaxy-background-transparent.png";

export default function AmbientGalaxy({ profile = false }: { profile?: boolean }) {
  return (
    <div className={`ambient-galaxy ${profile ? "ambient-galaxy--profile" : ""}`} aria-hidden="true">
      <img src={galaxy} alt="" />
    </div>
  );
}
