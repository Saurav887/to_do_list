import { useRef, useEffect } from 'react'; 
import * as d3 from 'd3';

export default function TaskCount({ totalTasks }){
    const svgRef = useRef(null);
    let value1 = totalTasks-2, value2 = totalTasks-3;
    if(value1 < 0) value1 = 0;
    if(value2 < 0) value2 = 0;

    const data = [
      { label: "prev", value: value1, index: 0 },
      { label: "previous", value: value2, index: 1 },
      { label: "current", value: totalTasks, index: 2}
    ];
    
    useEffect( () => {
      const width = 200;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 20, left: 40 };

      // Create scales to map data to visual representation
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height - margin.bottom, margin.top]);

      // Set up the SVG container
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);
      
      const colorScale = d3.scaleOrdinal()
        .domain(data.map((d,i) => i))
        .range(["#CCCCFF", "#CCCCFF", "steelblue"]);
  
      // Draw the bars
      const bars = svg.selectAll('rect')
        .data(data);
        
      bars.enter()
        .append('rect')
        .attr('x', d => xScale(d.label))
        .attr('y', d => yScale(0))
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', (d) => colorScale(d.index)) // Set the color of the bars
        .on('mouseover', function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', '#40E0D0');
        })
        .on('mouseout', function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', (d) => colorScale(d.index));
        })

        bars.transition()
        .duration(1000)
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - margin.bottom - yScale(d.value)); // Update the height of the bars based on data

      bars.exit().remove(); // Remove any bars that are no longer in the data
      
      // Add X-axis
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      // // Add Y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    }, [totalTasks]);
      
    
    return (
      <svg ref={svgRef} />
    );
  }