export async function fetchProfile(acessToken) {
    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${acessToken}`,
        },
    });

    return await response.json();
}

export async function fetchTopArtists(acessToken, timeRange, limit, offset) {
    const params = new URLSearchParams({
        type: "artists",
        time_range: timeRange,
        limit: limit,
        offset: offset,
    });

    const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${acessToken}`,
            },
        }
    );

    return await response.json();
}

export async function fetchTopTracks(acessToken, timeRange, limit, offset) {
    const params = new URLSearchParams({
        type: "tracks",
        time_range: timeRange,
        limit: limit,
        offset: offset,
    });

    const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${acessToken}`,
            },
        }
    );

    return await response.json();
}

export async function fetchFollowedArtists(acessToken, limit) {
    const params = new URLSearchParams({
        type: "artist",
        limit: limit,
    });

    const response = await fetch(
        `https://api.spotify.com/v1/me/following?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${acessToken}`,
            },
        }
    );

    return await response.json();
}
