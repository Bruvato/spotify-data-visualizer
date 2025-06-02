import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import withNextAuthStrategy from "@/lib/client-instance";


export const createSpotifyClientWithAccessToken = (
  accessToken: string,
  refreshToken: string,
  accessTokenExpires: number
) => {
  return SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID ?? "", {
    access_token: accessToken,
    token_type: "Bearer",
    refresh_token: refreshToken,
    expires_in: accessTokenExpires,
  });
};

export const fetchUserProfile = async (spotifyApi: SpotifyApi) => {
  try {
    const response = await spotifyApi.currentUser.profile();
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchTopArtists = async (spotifyApi: SpotifyApi) => {
  try {
    const response = await spotifyApi.currentUser.topItems(
      "artists",
      "long_term",
      50
    );
    return response.items;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

export const fetchTopTracks = async (spotifyApi: SpotifyApi) => {
  try {
    const response = await spotifyApi.currentUser.topItems(
      "tracks",
      "long_term",
      50
    );
    return response.items;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

export const fetchRecentlyPlayed = async (spotifyApi: SpotifyApi) => {
  try {
    const response = await spotifyApi.player.getRecentlyPlayedTracks(50);
    return response.items;
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    throw error;
  }
};
