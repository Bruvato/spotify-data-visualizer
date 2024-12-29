import { useEffect, useRef, useState } from "react";
import { getAccessToken } from "./utils/authUtils";
import { fetchProfile, fetchTopArtists, fetchTopTracks } from "./utils/api";
import Graph from "./Graph";
import Slider from "./Slider";

export default function Callback() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const [profile, setProfile] = useState(null);
    const [artists, setArtists] = useState(null);
    const [tracks, setTracks] = useState(null);
    const [data, setData] = useState(null);

    const [isPending, setIsPending] = useState(true);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            (async () => {
                const accessToken = await getAccessToken(code);

                const userProfile = await fetchProfile(accessToken);
                setProfile(userProfile);

                const [topArtists1, topArtists2, topArtists3, topArtists4] =
                    await Promise.all([
                        fetchTopArtists(accessToken, "long_term", 50, 0),
                        fetchTopArtists(accessToken, "long_term", 50, 50),
                        fetchTopArtists(accessToken, "long_term", 50, 100),
                        fetchTopArtists(accessToken, "long_term", 50, 150),
                    ]);

                const combinedTopArtists = [
                    ...topArtists1.items,
                    ...topArtists2.items,
                    ...topArtists3.items,
                    ...topArtists4.items,
                ];

                setArtists(combinedTopArtists);

                const topTracks = await fetchTopTracks(accessToken);
                setTracks(topTracks.items);

                setIsPending(false);
            })();
        }
    }, []);

    useEffect(() => {
        if (artists) {
            const newData = artists.map((artist) => ({
                id: artist.name,
                value: artist.followers.total,
                category: artist.genres,
            }));
            setData(newData);
        }
    }, [artists]);

    if (isPending) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="">
            <h1 className="text-5xl font-bold leading-none tracking-tight ">
                Welcome, {profile.display_name}
            </h1>
            <img
                src={profile.images[0].url}
                alt="profile pictire"
                className="rounded-full"
            />
            <Slider />

            <Graph data={data} />
            {artists.map((artist) => (
                <div className="" key={artist.id}>
                    <p>
                        artist: {artist.name}, popularity: {artist.popularity},
                        genres: {[artist.genres]}
                    </p>
                    <img
                        src={artist.images[0].url}
                        alt=""
                        className="rounded-full w-10 h-10"
                    />
                </div>
            ))}
            {tracks.map((track) => (
                <div className="" key={track.id}>
                    {track.name + ": " + track.popularity}
                </div>
            ))}
        </div>
    );
}
