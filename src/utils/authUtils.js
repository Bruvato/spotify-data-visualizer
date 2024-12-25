const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

export async function redirectToAuthCodeFlow() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: "http://localhost:5173/callback",
        scope: "user-read-private user-read-email user-top-read",
        code_challenge_method: "S256",
        code_challenge: challenge,
    });

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export function generateCodeVerifier(length) {
    let text = "";
    let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function getAccessToken(authorizationCode) {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null && access_token !== "undefined") {
        getRefreshToken();
        return localStorage.getItem("access_token");
    }

    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: "http://localhost:5173/callback",
        code_verifier: verifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    const responseBody = await response.json();

    localStorage.setItem("access_token", responseBody.access_token);
    localStorage.setItem("refresh_token", responseBody.refresh_token);

    return responseBody.access_token;
}

export async function getRefreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    const responseBody = await response.json();

    localStorage.setItem("access_token", responseBody.access_token);
    if (responseBody.refresh_token) {
        localStorage.setItem("refresh_token", responseBody.refresh_token);
    }

    return responseBody.refreshToken;
}
