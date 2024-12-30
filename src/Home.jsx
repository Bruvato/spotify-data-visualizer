import { useState } from "react";
import { redirectToAuthCodeFlow } from "./utils/authUtils";

export default function Home() {
    const [darkMode, setDarkMode] = useState(true);

    const handleLogIn = () => {
        redirectToAuthCodeFlow();
    };

    return (
        <div className="min-h-screen flex items-start grid content-center">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    Spotify Data Visualizer
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    Your music stats, beautifully visualized.
                </p>{" "}
                <button
                    onClick={handleLogIn}
                    className="text-white
                            bg-gradient-to-br from-green-400 to-blue-600
                            hover:bg-gradient-to-bl
                            font-bold
                            py-2 px-4
                            rounded-full
                            text-center"
                >
                    Log in with Spotify
                </button>
            </div>
        </div>
    );
}
