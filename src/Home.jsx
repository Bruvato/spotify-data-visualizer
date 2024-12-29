import { useState } from "react";
import { redirectToAuthCodeFlow } from "./utils/authUtils";

export default function Home() {
    const handleLogIn = () => {
        redirectToAuthCodeFlow();
    };

    return (
        <>
            <div className="text-center">
                <h1 className="mb-4 text-5xl font-bold leading-none tracking-tight ">
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
                            rounded-full"
                >
                    Log in with Spotify
                </button>
            </div>
        </>
    );
}
