import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Callback from "./Callback";

export default function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/callback" element={<Callback />} />
                </Routes>
            </Router>
        </div>
    );
}
