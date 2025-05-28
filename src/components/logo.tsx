import Link from "next/link";
import JamStatsLogo from "./icons/jam-stats-logo";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <JamStatsLogo />
      <h3 className="text-2xl font-bold">
        Jam
        <span className="text-violet-500">Stats</span>
      </h3>
    </Link>
  );
}
