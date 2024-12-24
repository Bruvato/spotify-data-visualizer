import { useEffect, useRef, useState } from "react";
import { getAccessToken } from "./utils/authUtils";
import { fetchProfile, fetchTopArtists, fetchTopTracks } from "./utils/api";

export default function Callback() {
    // TODO: local storage

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const [profile, setProfile] = useState(null);
    const [artists, setArtists] = useState(null);
    const [tracks, setTracks] = useState(null);

    const [isPending, setIsPending] = useState(true);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            (async () => {
                const accessToken = await getAccessToken(clientId, code);

                const userProfile = await fetchProfile(accessToken);
                setProfile(userProfile);

                const topArtists = await fetchTopArtists(accessToken);
                setArtists(topArtists.items);

                const topTracks = await fetchTopTracks(accessToken);
                setTracks(topTracks.items)

                setIsPending(false);
            })();
        }
    }, []);

    if (isPending) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1 className="text-5xl font-bold">
                Welcome, {profile.display_name}
            </h1>
            <p>Email: {profile.email}</p>
            <p>{profile.country}</p>
            <img
                src={profile.images[0].url}
                alt="profile pictire"
                className="rounded-full"
            />
            {artists.map((artist) => (
                <div className="" key={artist.id}>
                    {artist.name + ": " + artist.popularity}
                </div>
            ))}
            {artists.map((artist) => (
                <div className="" key={artist.id}>
                    {artist.name + ": " + artist.popularity}
                </div>
            ))}
        </>
    );
}
