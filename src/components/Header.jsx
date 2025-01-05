import Button from "./Button";

import { redirectToAuthCodeFlow } from "../utils/authUtils";

import { AiFillSpotify } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";

export default function Header({ profile }) {
    const handleLogIn = () => {
        redirectToAuthCodeFlow();
    };

    const handleLogOut = () => {
        localStorage.clear();
        location.href = "/";
    };
    return (
        <nav
            className="absolute
            w-full
            shadow-md
            z-50"
        >
            <div
                className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8 flex w-full justify-between items-center
                py-4
                font-bold"
            >
                <a href="" className="flex items-center gap-2">
                    <AiFillSpotify className="w-10 h-10" />
                    <h3 className="text-xl">Spotify Data Visualizer</h3>
                </a>

                <ul className="flex gap-4 items-center">
                    <li>
                        <a
                            href={profile ? profile.external_urls.spotify : ""}
                            target={profile ? "_blank" : "_self"}
                        >
                            <Button className="flex items-center gap-2 rounded-full pl-4 bg-neutral-200 dark:bg-neutral-800">
                                <h1>
                                    {profile ? profile.display_name : "User"}
                                </h1>
                                {profile ? (
                                    <img
                                        src={profile.images[0].url}
                                        alt="User Profile Picutre"
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <AiOutlineUser className="w-10 h-10 rounded-full bg-neutral-400 fill-neutral-900" />
                                )}
                            </Button>
                        </a>
                    </li>
                    <li>
                        <Button
                            className="bg-neutral-200 dark:bg-neutral-800"
                            variant="primary"
                            onClick={profile ? handleLogOut : handleLogIn}
                        >
                            {profile ? "Log Out" : "Log In"}
                        </Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}