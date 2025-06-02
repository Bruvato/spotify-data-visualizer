import { auth } from "@/lib/auth";

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

import {
  fetchTopArtists,
  fetchTopTracks,
  fetchRecentlyPlayed,
  createSpotifyClientWithAccessToken,
  fetchUserProfile,
} from "@/lib/spotify-service";
import {
  Artist,
  PlayHistory,
  Track,
  UserProfile,
} from "@spotify/web-api-ts-sdk";

export default async function Dashboard() {
  const session = await auth();

  let user: UserProfile;
  let topArtists: Artist[];
  let topTracks: Track[];
  let recentlyPlayed: PlayHistory[];

  if (session && session.user) {
    const spotifyApiWithAccessToken = createSpotifyClientWithAccessToken(
      session?.accessToken ?? "",
      session?.refreshToken ?? "",
      session?.accessTokenExpires ?? 0
    );

    user = await fetchUserProfile(spotifyApiWithAccessToken);
    topArtists = await fetchTopArtists(spotifyApiWithAccessToken);
    topTracks = await fetchTopTracks(spotifyApiWithAccessToken);
    recentlyPlayed = await fetchRecentlyPlayed(spotifyApiWithAccessToken);
  } else {
    user = {
      display_name: "Guest",
      email: "guest@example.com",
      country: "US",
      explicit_content: {
        filter_enabled: false,
        filter_locked: false,
      },
      external_urls: {
        spotify: "",
      },
      followers: {
        href: null,
        total: 0,
      },
      href: "",
      id: "guest",
      images: [],
      product: "free",
      type: "user",
      uri: "",
    };
    topArtists = [];
    topTracks = [];
    recentlyPlayed = [];
  }

  const topGenres = topArtists
    ? topArtists
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
              {topArtists && topArtists.length > 0 ? (
                topArtists.map((artist: any, index: number) => (
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
              {topTracks && topTracks.length > 0 ? (
                topTracks.map((track: any, index: number) => (
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
                          <div className="p-4 flex flex-col">
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
        <div id="recently-played" className="rounded-xl bg-card p-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <div className="w-full overflow-hidden rounded-md border h-full border-none">
            {recentlyPlayed && recentlyPlayed.length > 0 ? (
              <div className="flex flex-col gap-4 overflow-auto h-full">
                {recentlyPlayed.slice(0, 50).map((item: any) => (
                  <div
                    key={item.played_at}
                    className="flex items-center gap-4 p-4 rounded-md hover:bg-muted/50 transition-colors shadow-sm"
                  >
                    {/* Album Image */}
                    {item.track.album && item.track.album.images && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                        <img
                          src={
                            item.track.album.images[0].url || "/placeholder.svg"
                          }
                          alt={item.track.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {/* Track Info */}
                    <div className="flex-1">
                      <span className="block text-sm font-medium truncate">
                        {item.track.name}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {item.track.artists
                          .map((artist: any) => artist.name)
                          .join(", ")}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {item.track.album.name}
                      </span>
                    </div>
                    {/* Played Time */}
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.played_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
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
  );
}
