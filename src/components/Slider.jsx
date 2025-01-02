import { useState } from "react";

export default function Slider() {
    const [num, setNum] = useState(1);

    function handleChange(e) {
        setNum(e.target.value);
    }

    return (
        <div>
            <input
                type="range"
                min="0"
                max="100"
                value={num}
                onChange={handleChange}
            />
            {num}
        </div>
    );
}
