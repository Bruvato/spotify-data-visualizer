import { useEffect, useRef, useState } from "react";
import { getAccessToken } from "../utils/authUtils";
import {
    fetchProfile,
    fetchTopArtists,
    fetchTopTracks,
    fetchFollowedArtists,
} from "../utils/api";
import Graph from "../components/Graph";
import PieChart from "../components/PieChart";
import Slider from "../components/Slider";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import ContentWrapper from "../components/ContentWrapper";

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState("long_term");
    const [profile, setProfile] = useState(null);
    const [artists, setArtists] = useState(null);
    const [tracks, setTracks] = useState(null);
    const [followedArtists, setFollowedArtists] = useState(null);
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
                        fetchTopArtists(accessToken, timeRange, 50, 0),
                        fetchTopArtists(accessToken, timeRange, 50, 50),
                        fetchTopArtists(accessToken, timeRange, 50, 100),
                        fetchTopArtists(accessToken, timeRange, 50, 150),
                    ]);

                const combinedTopArtists = [
                    ...topArtists1.items,
                    ...topArtists2.items,
                    ...topArtists3.items,
                    ...topArtists4.items,
                ];

                setArtists(combinedTopArtists);

                const followed = await fetchFollowedArtists(accessToken, 50);
                setFollowedArtists(followed);

                const topTracks = await fetchTopTracks(
                    accessToken,
                    timeRange,
                    50,
                    0
                );
                setTracks(topTracks.items);

                setIsPending(false);
            })();
        }
    }, [timeRange]);

    useEffect(() => {
        if (artists) {
            const newData = artists.map((artist) => ({
                id: artist.name,
                value: artist.followers.total,
                category: artist.genres,
            }));
            setData(newData);
        }
    }, [artists, timeRange]);

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
            <div className="pt-24">
                <Wrapper className="">
                    <ContentWrapper className="flex items-center gap-4">
                        <img
                            src={profile.images[0].url}
                            alt="profile picture"
                            className="rounded-full w-48 h-48"
                        />
                        <div className="grid gap-2">
                            <h1 className="text-5xl font-bold leading-none tracking-tight ">
                                Welcome, {profile.display_name || "User"}
                            </h1>
                            <h2 className="text-xl">
                                {profile.followers.total} Followers •{" "}
                                {followedArtists.artists.total == 50
                                    ? "50+"
                                    : followedArtists.artists.total}{" "}
                                Following • {profile.country}
                            </h2>
                        </div>
                    </ContentWrapper>
                </Wrapper>
            </div>

            <Wrapper className="mt-8">
                <ContentWrapper className="grid gap-4">
                    <div className="grid gap-2">
                        <h2 className="text-4xl font-bold">
                            Top Artists by Followers
                        </h2>
                        <p className="">
                            Your Top Artists by Followers and connected by
                            genres
                        </p>
                    </div>
                    <Graph data={data} />
                </ContentWrapper>

                <section>
                    <PieChart data={data} />
                </section>
            </Wrapper>

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
                        popularity: {artist.popularity}, genres: {artist.genres}
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
        </>
    );
}
