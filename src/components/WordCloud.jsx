import { useEffect } from "react";

import * as d3 from "d3";

export default function WordCloud({ data }) {
    useEffect(() => {
        const rollup = d3.rollup(
            data,
            (v) => v.length,
            (d) => d.category
        );
    });
    return <div>WordCloud</div>;
}
