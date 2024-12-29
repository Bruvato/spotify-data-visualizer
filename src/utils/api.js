export async function fetchProfile(access_token) {
    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return await response.json();
}

export async function fetchTopArtists(access_token, time_range, limit, offset) {
    const params = new URLSearchParams({
        type: "artists",
        time_range: time_range,
        limit: limit,
        offset: offset,
    });

    const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );

    return await response.json();
}

export async function fetchTopTracks(access_token) {
    const params = new URLSearchParams({
        type: "tracks",
        time_range: "long_term",
        limit: 50,
        offset: 0,
    });

    const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );

    return await response.json();
}
