import { twMerge } from "tailwind-merge";

export default function ProfilePicture({ profile, className }) {
    return (
        <div className="rounded-full">
            {profile?.images?.[0]?.url ? (
                <img src={profile.images[0].url} alt="profile picture" />
            ) : (
                <svg className={twMerge(className, "")} viewBox="0 0 100 100">
                    <circle
                        className="fill-neutral-950"
                        cx="50%"
                        cy="50%"
                        r="50%"
                    ></circle>
                    <text
                        className="fill-neutral-100 text-4xl"
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {profile?.display_name.charAt(0).toUpperCase() || "U"}
                    </text>
                </svg>
            )}
        </div>
    );
}
