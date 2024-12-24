export async function fetchProfile(access_token) {
    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return await response.json();
}

export async function fetchTopArtists(access_token) {
    const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return await response.json();
}

export async function fetchTopTracks(access_token) {
    const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return await response.json();
}
