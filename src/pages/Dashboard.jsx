import { useEffect, useRef, useState } from "react";
import { getAccessToken } from "../utils/authUtils";
import { fetchProfile, fetchTopArtists, fetchTopTracks } from "../utils/api";
import BubbleChart from "../components/BubbleChart";
import PieChart from "../components/PieChart";
import Slider from "../components/Slider";
import Header from "../components/Header";

export default function Dashboard() {
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
        let code = params.get("code");

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
        return (
            <div className="min-h-screen flex items-center grid content-center">
                <h1 className="text-center">Loading...</h1>
            </div>
        );
    }

    return (
        <>
            <Header profile={profile} />
            <div className="pt-20">
                <h1 className="text-5xl font-bold leading-none tracking-tight ">
                    Welcome, {profile.display_name || "User"}
                </h1>

                <img
                    src={profile.images[0].url}
                    alt="profile picture"
                    className="rounded-full"
                />
                <h2>{profile.country}</h2>
                <h2>{profile.followers.total} Followers</h2>

                <BubbleChart data={data} />

                <PieChart data={data} />

                <h1 className="text-4xl">Top Artists</h1>

                {artists.map((artist) => (
                    <div className="flex items-center" key={artist.id}>
                        <img
                            src={artist.images[0].url}
                            alt={`${artist.name} profile`}
                            className="sm:rounded-sm md:rounded-sm lg:rounded w-10 h-10"
                        />
                        <p>{artist.name}</p>:
                        <span>
                            popularity: {artist.popularity}, genres:{" "}
                            {artist.genres}
                        </span>
                    </div>
                ))}

                <h1 className="text-4xl">Top Tracks</h1>

                {tracks.map((track) => (
                    <div className="flex items-center" key={track.id}>
                        <img
                            src={track.album.images[0].url}
                            alt={`${track.album.name} image`}
                            className="sm:rounded-sm md:rounded-sm lg:rounded w-10 h-10"
                        />
                        <p>{track.name}</p>:
                        <span>popularity: {track.popularity},</span>
                    </div>
                ))}
            </div>
        </>
    );
}
