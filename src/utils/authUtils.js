const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// const REDIRECT_URI = "http://localhost:5173/callback";
const REDIRECT_URI = "https://spotify-data-visualizer-tau.vercel.app/callback";

const SCOPE =
    "user-read-private user-read-email user-top-read user-follow-read";

export async function redirectToAuthCodeFlow() {
    const codeVerifier = generateCodeVerifier(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPE,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
    });

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = "";
    let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    return codeChallenge;
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);

    return window.crypto.subtle.digest("SHA-256", data);
}

function base64encode(input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

export async function getAccessToken(authorizationCode) {
    const access_token = localStorage.getItem("access_token");

    if (access_token && access_token !== "undefined") {
        await getRefreshToken();
        return localStorage.getItem("access_token");
    }

    const codeVerifier = localStorage.getItem("code_verifier");

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
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

async function getRefreshToken() {
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
