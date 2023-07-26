import { useRef, useEffect } from 'react'; 
import * as d3 from 'd3';

export default function Successful({ rate }){
    const svgRef = useRef(null);
    
    useEffect(() => {
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2;
      const arcThickness = 35;
  
      let data = [];
      for(let i=0; i<20; i++){
        data.push({value: 1});
      }
  
      const pie = d3.pie()
        .value(d => d.value)
        .padAngle(0.08)
        .startAngle(-Math.PI * 0.75)
        .endAngle(Math.PI * 0.75);

      const arc = d3.arc()
        .innerRadius(radius - arcThickness)
        .outerRadius(radius);

      let fill = rate * 20 / 100;

      let color = [], opacity = 0.05;
      for(let i=0; i<fill; i++){ 
          let c = d3.color("steelblue");
          c.opacity = opacity;
          color.push(c);
          opacity += 0.049;
      }
      for(let i=fill; i<20; i++) color.push("#F5F5DC");

      const colorScale = d3.scaleOrdinal()
        .domain(data.map((d,i) => i))
        .range(color);
  
      // Set up the SVG container
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      // Generate the pie chart data
      const pieData = pie(data);
  
      // Create the pie slices
      const slices = svg.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', d => arc({
        ...d,
        startAngle: -Math.PI * 0.75,
        endAngle: Math.PI * 0.75,
      }))
      .attr('fill', (d, i) => colorScale(i));

      // Animate the transition for loading the chart
      slices.transition()
        .duration(1000)
        .attrTween('d', d => {
          const interpolate = d3.interpolate({ startAngle: -Math.PI, endAngle: 0 }, d);
          return t => arc(interpolate(t));
        })

    }, [rate]);
      
    
    return (
        <svg ref={svgRef} />
    );
  }