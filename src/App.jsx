import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import NoPage from "./pages/NoPage";

import Button from "./components/Button";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

export default function App() {
    const [darkMode, setDarkMode] = useState(true);

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`${darkMode && "dark"}`}>
            <main
                className="bg-neutral-100 dark:bg-neutral-900
                    text-neutral-900 dark:text-neutral-100
                    min-h-screen"
            >
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/callback" element={<Dashboard />} />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </Router>

                <Footer />

                <Button
                    onClick={handleDarkMode}
                    className="fixed w-16 h-16 bottom-16 right-16 
                bg-neutral-900 dark:bg-neutral-100"
                    variant="icon"
                >
                    {darkMode ? (
                        <AiFillSun className="w-10 h-10 fill-neutral-900" />
                    ) : (
                        <AiFillMoon className="w-10 h-10 fill-neutral-100" />
                    )}
                </Button>
            </main>
        </div>
    );
}
