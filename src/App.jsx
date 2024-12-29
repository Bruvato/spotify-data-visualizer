import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Home from "./Home";
import Callback from "./Callback";

export default function App() {
    const [darkMode, setDarkMode] = useState(true);

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`${darkMode && "dark"}`}>
            <div
                className="bg-neutral-100 dark:bg-neutral-900
                text-gray-900 dark:text-white
                min-h-screen flex items-start grid content-center"
            >
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/callback" element={<Callback />} />
                    </Routes>
                </Router>
            </div>

            <button
                onClick={handleDarkMode}
                className="fixed w-16 h-16 bottom-16 right-16 rounded-full bg-neutral-900 dark:bg-neutral-100"
            ></button>
        </div>
    );
}
