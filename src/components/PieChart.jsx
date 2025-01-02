import { useEffect, useRef } from "react";
import * as d3 from "d3";


export default function PieChart({ data }) {
    const svgRef = useRef();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;


    }, []);

    return <div></div>;
}
