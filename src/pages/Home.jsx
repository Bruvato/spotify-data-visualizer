import { redirectToAuthCodeFlow } from "../utils/authUtils";
import Button from "../components/Button";

export default function Home() {
    const handleLogIn = () => {
        redirectToAuthCodeFlow();
    };

    return (
        <div className="min-h-screen flex items-start grid content-center">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-neutral-900 md:text-5xl lg:text-6xl dark:text-neutral-100">
                    Spotify Data Visualizer
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    Your music stats, beautifully visualized.
                </p>{" "}
                <Button
                    onClick={handleLogIn}
                    className="
                            bg-gradient-to-br from-green-400 to-blue-600
                            hover:bg-gradient-to-bl
                            "
                >
                    Log in with Spotify
                </Button>
            </div>
        </div>
    );
}
