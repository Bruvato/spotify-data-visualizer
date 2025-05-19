import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import Link from "next/link";

import SignOutButton from "@/components/sign-out-button";

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
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session?.user?.name ?? "Guest",
          email: session?.user?.email ?? "guest@example.com",
          avatar: session?.user?.image ?? "",
        }}
      />
      <SidebarInset className="flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Summary</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 pr-4">
            {session ? (
              <SignOutButton />
            ) : (
              <Button variant="outline">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col gap-6 p-4 w-full max-w-full">
            {/* Profile Section */}
            <div className="rounded-xl bg-card p-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="md:col-span-1 bg-muted/20 rounded-lg p-5 flex flex-col items-center text-center h-full">
                  <Avatar className="w-80 h-80 rounded-xl mb-4">
                    <AvatarImage
                      src={user.images?.[0]?.url || "/placeholder.svg"}
                      alt={user.display_name}
                    />
                    <AvatarFallback className="rounded-xl text-4xl">
                      {user.display_name?.charAt(0).toUpperCase() || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{user.display_name}</h2>
                  <p className="text-muted-foreground mt-1">{user.email}</p>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {user.followers?.total || 0} followers
                    </Badge>
                    <Badge variant="outline">{user.country}</Badge>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Top Artists */}
                    <div className="bg-muted/20 rounded-lg p-4 h-full">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-md"></div>
                        Top Artists
                      </h3>
                      <div className="space-y-3">
                        {topArtists.items &&
                          topArtists.items
                            .slice(0, 5)
                            .map((artist: any, index: number) => (
                              <div
                                key={artist.id}
                                className="flex items-center gap-3 bg-background/50 rounded-md p-2 hover:bg-background transition-colors"
                              >
                                <div className="relative h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
                                  <img
                                    src={
                                      artist.images?.[0]?.url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={artist.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="text-sm font-medium truncate flex-1">
                                  {artist.name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="flex-shrink-0"
                                >
                                  #{index + 1}
                                </Badge>
                              </div>
                            ))}
                      </div>
                    </div>

                    {/* Top Tracks */}
                    <div className="bg-muted/20 rounded-lg p-4 h-full">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-md"></div>
                        Top Tracks
                      </h3>
                      <div className="space-y-3">
                        {topTracks.items &&
                          topTracks.items
                            .slice(0, 5)
                            .map((track: any, index: number) => (
                              <div
                                key={track.id}
                                className="flex items-center gap-3 bg-background/50 rounded-md p-2 hover:bg-background transition-colors"
                              >
                                <div className="relative h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
                                  <img
                                    src={
                                      track.album?.images?.[0]?.url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={track.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium truncate block">
                                    {track.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground truncate block">
                                    {track.artists
                                      .map((artist: any) => artist.name)
                                      .join(", ")}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="flex-shrink-0"
                                >
                                  #{index + 1}
                                </Badge>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Genres - Below */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-md"></div>
                      Top Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sortedTopGenres.map((item) => (
                        <Badge
                          key={item.genre}
                          variant="secondary"
                          className="capitalize py-1"
                        >
                          {item.genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Artists Carousel */}
            <div className="rounded-xl bg-card p-6 w-full">
              <h2 className="text-2xl font-bold mb-6">Top Artists</h2>
              <div className="carousel-container relative w-full">
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
                          className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                          <Card className="overflow-hidden border-0 shadow-sm">
                            <CardContent className="p-0">
                              <div className="flex flex-col">
                                {artist.images && artist.images[0] && (
                                  <div className="relative aspect-square w-full overflow-hidden">
                                    <img
                                      src={
                                        artist.images[0].url ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg"
                                      }
                                      alt={artist.name}
                                      className="h-full w-full object-cover transition-transform hover:scale-105"
                                    />
                                  </div>
                                )}
                                <div className="p-4">
                                  <span className="block text-base font-semibold truncate">
                                    {artist.name}
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
            </div>

            {/* Top Tracks Carousel */}
            <div className="rounded-xl bg-card p-6 w-full">
              <h2 className="text-2xl font-bold mb-6">Top Tracks</h2>
              <div className="carousel-container relative w-full">
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
                          className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                          <Card className="overflow-hidden border-0 shadow-sm h-full">
                            <CardContent className="p-0 h-full">
                              <div className="flex flex-col h-full">
                                {track.album &&
                                  track.album.images &&
                                  track.album.images[0] && (
                                    <div className="relative aspect-square w-full overflow-hidden">
                                      <img
                                        src={
                                          track.album.images[0].url ||
                                          "/placeholder.svg" ||
                                          "/placeholder.svg"
                                        }
                                        alt={track.name}
                                        className="h-full w-full object-cover transition-transform hover:scale-105"
                                      />
                                    </div>
                                  )}
                                <div className="p-4 flex flex-col flex-grow">
                                  <span className="block text-base font-semibold truncate">
                                    {track.name}
                                  </span>
                                  <span className="text-sm text-muted-foreground truncate">
                                    {track.artists
                                      .map((artist: any) => artist.name)
                                      .join(", ")}
                                  </span>
                                  <div className="mt-auto pt-2">
                                    <span className="text-sm text-muted-foreground">
                                      #{index + 1}
                                    </span>
                                  </div>
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
            </div>

            {/* Recently Played and Top Genres Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recently Played Section */}
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
                          {recentlyPlayed.items
                            .slice(0, 10)
                            .map((item: any) => (
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
                                    {new Date(
                                      item.played_at
                                    ).toLocaleTimeString([], {
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

              {/* Top Genres Section */}
              <div className="rounded-xl bg-card p-6 w-full h-full">
                <h2 className="text-2xl font-bold mb-4">Top Genres</h2>
                <div className="w-full overflow-hidden rounded-md border h-[calc(100%-3rem)]">
                  {sortedTopGenres && sortedTopGenres.length > 0 ? (
                    <div className="p-4 overflow-auto h-full">
                      <div className="grid grid-cols-1 gap-3">
                        {sortedTopGenres
                          .slice(0, 10)
                          .map((item: any, index) => (
                            <div
                              key={item.genre}
                              className="flex items-center justify-between bg-muted/50 rounded-md p-3 hover:bg-muted transition-colors"
                            >
                              <span className="text-sm font-medium capitalize">
                                {item.genre}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-primary h-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (item.count /
                                          sortedTopGenres[0].count) *
                                          100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {item.count}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center w-full p-4">
                      No top genres found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
