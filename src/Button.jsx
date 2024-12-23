import { redirectToAuthCodeFlow } from "./utils/authUtils";

function Button() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

    const handleClick = () => {
        redirectToAuthCodeFlow(clientId);
    };

    return (
        <button
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleClick}
        >
            Log in
        </button>
    );
}

export default Button;
