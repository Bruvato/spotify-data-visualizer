import Wrapper from "./Wrapper";

import { AiFillGithub } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";

export default function Footer() {
    return (
        <footer className="w-full bg-neutral-200 dark:bg-neutral-950">
            <Wrapper className="py-14">
                <div className="flex gap-4">
                    <a href="https://github.com/Bruvato/spotify-data-visualizer">
                        <AiFillGithub className="w-10 h-10" />
                    </a>
                </div>
                <br />
                <br />
                <p className="text-center">© 2025 Raymond Xu</p>
            </Wrapper>
        </footer>
    );
}
