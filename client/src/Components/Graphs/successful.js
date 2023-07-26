import { useRef, useEffect } from 'react'; 
import * as d3 from 'd3';

export default function Successful({ successful, rate }){
    const svgRef = useRef(null);
    
    useEffect(() => {
        const svg = d3.select(svgRef.current);
      
        // Define the dimensions of the arc
        const width = 175;
        const height = 175;
        const radius =  Math.min(width, height)/2;
        const arcThickness = 30;

        // let value = (Math.PI * rate * 0.01) - (Math.PI / 2);
        
        const data = [
          { startAngle: - Math.PI / 2 , endAngle: Math.PI / 2 },
          { startAngle: - Math.PI / 2 , endAngle: Math.PI / 4 },
        ];

        console.log(data[1]);
      
        // Create the arc generator
        const arcGenerator = d3.arc()
          .innerRadius(radius - arcThickness)
          .outerRadius(radius)
          .startAngle(d => d.startAngle)
          .endAngle(d => d.endAngle);

        const colorScale = d3.scaleOrdinal()
        .domain(data.map((d, i) => i)) // Domain is the index of each arc in the data array
        // .range(["#FFFF8F", "#0FFF50"]); 
        .range(["#CCCCFF", "steelblue"]);

        // Draw the arcs
        const arcs = svg.selectAll('path')
          .data(data)
          .enter()
          .append('path')
          .attr('d',d => arcGenerator({
            ...d,
            startAngle: 0,
            endAngle: 0,
          }))
          .attr('transform', `translate(${width * 3 / 4}, ${height * 3 / 4})`)
          .attr('fill', (d, i) => colorScale(i))
        
        arcs.transition()
        .duration(1000)
        .attrTween('d', d => {
          const interpolate = d3.interpolate({ startAngle: -Math.PI/2, endAngle: -Math.PI/2 }, d);
          return t => arcGenerator(interpolate(t));
        })

      }, [successful, rate]);
      
    
    return (
        <svg ref={svgRef} />
    );
  }