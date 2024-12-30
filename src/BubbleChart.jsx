import { useEffect, useRef, useState } from "react";

import * as d3 from "d3";

export default function BubbleChart({ data }) {
    const svgRef = useRef();
    const hasRun = useRef(false);

    const width = 928;
    const height = width;
    const margin = 1;

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console.log(data);

        const name = (d) => d.id;
        const group = (d) => d.category;
        const names = (d) => name(d).split(" ");

        const fontScale = d3.scaleLinear(
            [d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)],
            [10, 20]
        );
        const circleOpacity = d3.scaleLinear([0, data.length - 1], [1, 0.1]);

        const categories = [...new Set(data.flatMap((d) => group(d)))];

        const map = new Map();
        for (const d of data.flatMap((d) => group(d))) {
            if (map.has(d)) {
                map.set(d, map.get(d) + 1);
            } else {
                map.set(d, 1);
            }
        }
        const mapSorted = new Map(
            [...map.entries()].sort((a, b) => b[1] - a[1])
        );
        console.log(mapSorted);

        console.log(categories);

        const format = d3.format(",");

        const pack = d3
            .pack()
            .size([width - margin * 2, height - margin * 2])
            .padding(10);

        const color = d3.scaleOrdinal(d3.schemeTableau10);
        // const color = d3
        //     .scaleSequential(d3.interpolateTurbo)
        //     .domain([data.length - 1, 0]);

        const root = pack(d3.hierarchy({ children: data }).sum((d) => d.value));

        console.log(root);

        const svgElement = d3.select(svgRef.current);
        // svgElement
        //     .append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("viewBox", [-margin, -margin, width, height])
        //     .attr(
        //         "style",
        //         "max-width: 100%; height: auto; font: 10px sans-serif; outline: thin solid red"
        //     )
        //     .attr("text-anchor", "middle");

        const legend = svgElement
            .selectAll()
            .data(categories)
            .join("circle")
            .attr("cx", 50)
            .attr("cy", (d, i) => 50 + i * 50)
            .attr("r", 10)
            .attr("fill", (d) => color(d));

        const node = svgElement
            .append("g")
            .selectAll()
            .data(root.leaves())
            .join("g")
            .attr("transform", (d) => `translate(${d.x},${d.y})`);

        node.append("title").text((d) => `${d.data.id}\n${format(d.value)}`);

        node.append("circle")
            // .attr("fill-opacity", (d, i) => circleOpacity(i))
            .attr("fill-opacity", 0.5)
            .attr("fill", (d) => color(group(d.data)))
            // .attr("fill", (d, i) => color(i))
            .attr("stroke", (d) => color(group(d.data)))
            // .attr("stroke", (d, i) => color(i))
            .attr("r", (d) => d.r);

        const text = node
            .append("text")
            .attr("clip-path", (d) => `circle(${d.r})`)
            .style("font-size", (d) => fontScale(d.value) + "px");

        text.selectAll()
            .data((d) => names(d.data))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
            .text((d) => d);

        text.append("tspan")
            .attr("x", 0)
            .attr("y", (d) => `${names(d.data).length / 2 + 0.35}em`)
            .attr("fill-opacity", 0.7)
            .text((d) => format(d.value));
    }, []);

    return (
        <div className="fill-gray-900 dark:fill-white">
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`${-margin} ${-margin} ${width} ${height}`}
                style={{
                    maxWidth: "100%",
                    height: "auto",
                    font: "10px sans-serif",
                    outline: "thin solid blue",
                }}
                textAnchor="middle"
                shapeRendering="optimizeQuality"
            ></svg>
        </div>
    );
}
