import { auth } from "@/lib/auth";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import demoData from "./demo-data.json";

// Helper function to format milliseconds to mm:ss
function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default async function Dashboard() {
  const session = await auth();

  let user: {
      country: string;
      display_name: string;
      email: string;
      followers: { total: number };
      images: { url: string }[];
    } = {
      country: "",
      display_name: "",
      email: "",
      followers: { total: 0 },
      images: [],
    },
    topArtists: {
      items: {
        id: string;
        name: string;
        images: { url: string }[];
        genres: string[];
      }[];
    } = { items: [] },
    topTracks: {
      items: {
        id: string;
        name: string;
        album: { name: string; images: { url: string }[] };
        artists: { name: string }[];
        duration_ms: number;
      }[];
    } = { items: [] },
    recentlyPlayed: {
      items: {
        track: {
          id: string;
          name: string;
          album: { name: string; images: { url: string }[] };
          artists: { name: string }[];
          duration_ms: number;
        };
        played_at: string;
      }[];
    } = { items: [] };

  if (session && session.user) {
    const userData = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    user = await userData.json();

    const topArtistsData = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    topArtists = await topArtistsData.json();

    const topTracksData = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=0",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    topTracks = await topTracksData.json();

    const recentlyPlayedData = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    recentlyPlayed = await recentlyPlayedData.json();
  }

  const topGenres = topArtists.items
    ? topArtists.items
        .flatMap((artist: any) => artist.genres)
        .reduce((acc: Record<string, number>, genre: string) => {
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {})
    : {};

  const sortedTopGenres: { genre: string; count: number }[] = Object.entries(
    topGenres
  )
    .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
    .map(([genre, count]) => ({ genre, count: count as number }));

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col gap-6 p-4 w-full max-w-full">
        {/* Top Genres */}
        <div id="top-genres" className="rounded-xl bg-card p-6 w-full">
          <h2 className="text-2xl font-bold mb-6">Top Genres</h2>
          <div className="flex flex-wrap gap-2">
            {sortedTopGenres && sortedTopGenres.length > 0 ? (
              sortedTopGenres.map((item) => (
                <Badge
                  key={item.genre}
                  variant="secondary"
                  className="capitalize py-1"
                >
                  {item.genre}
                </Badge>
              ))
            ) : (
              <span className="text-center w-full p-8">
                No top genres found.
              </span>
            )}
          </div>
        </div>
        {/* Top Artists */}
        <div id="top-artists" className="rounded-xl bg-card p-6 w-full">
          <h2 className="text-2xl font-bold mb-6">Top Artists</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {topArtists.items && topArtists.items.length > 0 ? (
                topArtists.items.map((artist: any, index: number) => (
                  <CarouselItem
                    key={artist.id}
                    className="py-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                  >
                    <Card className="overflow-hidden p-4 border-0 shadow-sm hover:bg-muted">
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          {artist.images && artist.images[0] && (
                            <div className="relative aspect-square w-full overflow-hidden md:rounded-xs lg:rounded-sm">
                              <img
                                src={artist.images[0].url}
                                alt={artist.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <span className="block text-base font-semibold truncate">
                              <Link href={artist.uri}>{artist.name}</Link>
                            </span>
                            <span className="text-sm text-muted-foreground">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <span className="text-center w-full p-8">
                  No top artists found.
                </span>
              )}
            </CarouselContent>
            <div className="flex items-center justify-end gap-2 mt-4">
              <CarouselPrevious className="static transform-none" />
              <CarouselNext className="static transform-none" />
            </div>
          </Carousel>
        </div>
        {/* Top Tracks */}
        <div id="top-tracks" className="rounded-xl bg-card p-6 w-full">
          <h2 className="text-2xl font-bold mb-6">Top Tracks</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {topTracks.items && topTracks.items.length > 0 ? (
                topTracks.items.map((track: any, index: number) => (
                  <CarouselItem
                    key={track.id}
                    className="py-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                  >
                    <Card className="overflow-hidden p-4 border-0 shadow-sm hover:bg-muted">
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          {track.album &&
                            track.album.images &&
                            track.album.images[0] && (
                              <div className="relative aspect-square w-full overflow-hidden md:rounded-xs lg:rounded-sm">
                                <img
                                  src={track.album.images[0].url}
                                  alt={track.name}
                                  className="h-full w-full object-cover transition-transform hover:scale-105"
                                />
                              </div>
                            )}
                          <div className="p-4">
                            <span className="block text-base font-semibold truncate">
                              {track.name}
                            </span>
                            <span className="text-sm text-muted-foreground truncate">
                              {track.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                            </span>
                            <span className="text-sm text-muted-foreground mt-2">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <span className="text-center w-full p-8">
                  No top tracks found.
                </span>
              )}
            </CarouselContent>
            <div className="flex items-center justify-end gap-2 mt-4">
              <CarouselPrevious className="static transform-none" />
              <CarouselNext className="static transform-none" />
            </div>
          </Carousel>
        </div>
        {/* Recently Played Section */}
        <div
          id="recently-played"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="rounded-xl bg-card p-6 w-full h-full">
            <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
            <div className="w-full overflow-hidden rounded-md border h-[calc(100%-3rem)]">
              {recentlyPlayed.items && recentlyPlayed.items.length > 0 ? (
                <div className="overflow-auto h-full">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr className="text-xs font-medium text-muted-foreground">
                        <th className="p-2 text-left w-10"></th>
                        <th className="p-2 text-left">Song</th>
                        <th className="p-2 text-left hidden md:table-cell">
                          Artist
                        </th>
                        <th className="p-2 text-left hidden lg:table-cell">
                          Album
                        </th>
                        <th className="p-2 text-right hidden sm:table-cell">
                          Duration
                        </th>
                        <th className="p-2 text-right">Played</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentlyPlayed.items.slice(0, 10).map((item: any) => (
                        <tr
                          key={item.played_at}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-2">
                            {item.track.album &&
                              item.track.album.images &&
                              item.track.album.images[2] && (
                                <div className="relative h-10 w-10 overflow-hidden rounded-sm">
                                  <img
                                    src={
                                      item.track.album.images[2].url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.track.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                          </td>
                          <td className="p-2">
                            <span className="block text-sm font-medium truncate">
                              {item.track.name}
                            </span>
                            <span className="block text-xs text-muted-foreground md:hidden truncate">
                              {item.track.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                            </span>
                          </td>
                          <td className="p-2 hidden md:table-cell">
                            <span className="text-sm truncate block max-w-[150px]">
                              {item.track.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                            </span>
                          </td>
                          <td className="p-2 hidden lg:table-cell">
                            <span className="text-sm truncate block max-w-[150px]">
                              {item.track.album.name}
                            </span>
                          </td>
                          <td className="p-2 text-right hidden sm:table-cell">
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(item.track.duration_ms)}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(item.played_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center w-full p-4">
                  No recently played tracks found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
