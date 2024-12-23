import { useEffect, useRef, useState } from "react";
import { getAccessToken } from "./utils/authUtils";
import { fetchProfile } from "./utils/api";

function Callback() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const [profile, setProfile] = useState(null);
    const hasRunEffect = useRef(false);

    useEffect(() => {
        if (hasRunEffect.current) return;
        hasRunEffect.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            (async () => {
                const accessToken = await getAccessToken(clientId, code);
                const userProfile = await fetchProfile(accessToken);
                setProfile(userProfile);
            })();
        }
    }, [clientId]);

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">
                Welcome, {profile.display_name}
            </h1>
            <p>Email: {profile.email}</p>
            <p>{profile.country}</p>
            <img src={profile.images[0].url} alt="profile pictire" className="rounded-full"/>
        </div>
    );
}

export default Callback;
