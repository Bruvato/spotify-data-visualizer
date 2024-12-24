import { redirectToAuthCodeFlow } from "./utils/authUtils";

import Button from "./Button";

export default function Home() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

    const handleClick = () => {
        redirectToAuthCodeFlow(clientId);
    };

    return (
        <>
            <Button onClick={handleClick} />
        </>
    );
}
