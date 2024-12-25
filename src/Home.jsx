import { redirectToAuthCodeFlow } from "./utils/authUtils";

import Button from "./Button";

export default function Home() {

    const handleClick = () => {
        redirectToAuthCodeFlow();
    };

    return (
        <>
            <Button onClick={handleClick} />
        </>
    );
}
