/*******************************************************************
 * This javascript file plots the interractive graphs for the census and health
 * data for this project using D3.js
 ******************************************************************/

 // set the svg size
var svgWidth = 800;
var svgHeight = 500;

// set the margins
var margin = {
    top: 40,
    right: 20,
    bottom: 90,
    left: 90
  };
  
  // calculate the plot area dimensions
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  //Scales for the axes
  var xScale = null;
  var yScale = null;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

function createXAxis(healthData, xValue){
    console.log("Recreating X Axis");

    // remove existing x-axis
    d3.select("#xAxis")
        .remove();
    
    switch (xValue) {
        case "White":
            console.log("White");
             xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.White)])
                .range([0, width]);
                break;
        case "AfricanAmerican":
            console.log("AfricanAmerican");
            xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.AfricanAmerican)])
                .range([0, width]);
            break;
        case "AmericanIndian":
            console.log("AmericanIndian");
            xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.AmericanIndian)])
                .range([0, width]);
            break;
        case "Asian":
            console.log("Asian");
            xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.Asian)])
                .range([0, width]);
            break;
    }

    // Create the axes
    var bottomAxis = d3.axisBottom(xScale);

    // Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("id", "xAxis")
        .call(bottomAxis)

};

function createYAxis(healthData, yValue){
    console.log("Recreating Y Axis");

    // remove existing y-axis
    d3.select("#yAxis")
    .remove();

    //Create a scale for your dependent (y) coordinates
    switch (yValue) {
        case "HaveHealthCare":
            console.log("HaveHealthCare");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.HaveHealthCare)+1])
                .range([height, 0])
            break;
        case "HaveDepression":
            console.log("HaveDepression");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.HaveDepression)+1])
                .range([height, 0])
            break;
        case "HaveAsthma":
            console.log("HaveAsthma");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.HaveAsthma)+1])
                .range([height, 0])
            break;
        case "HaveArthritis":
            console.log("HaveArthritis");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.HaveArthritis)+1])
                .range([height, 0])
            break;
    }

    var leftAxis = d3.axisLeft(yScale);

    // Add y-axis
    chartGroup.append("g")
        .call(leftAxis)
        .attr("id", "yAxis");

};

function transitionCircles(axis, dataColumn) {
    var circles = chartGroup.selectAll("circle");
    var texts = chartGroup.selectAll("#circleText");


    if (axis == "x") {  // transition the cx vaalues
        if (dataColumn == "White") {
            circles.transition().duration(1000).attr("cx", d => xScale(d.White));
            texts.transition().duration(1000).attr("x", d => xScale(d.White)-5);
        } else if (dataColumn == "AfricanAmerican") {
            circles.transition().duration(1000).attr("cx", d => xScale(d.AfricanAmerican));
            texts.transition().duration(1000).attr("x", d => xScale(d.AfricanAmerican)-5);
        } else if (dataColumn == "AmericanIndian") {
            circles.transition().duration(1000).attr("cx", d => xScale(d.AmericanIndian));
            texts.transition().duration(1000).attr("x", d => xScale(d.AmericanIndian)-5);
        }else {
            circles.transition().duration(1000).attr("cx", d => xScale(d.Asian));
            texts.transition().duration(1000).attr("x", d => xScale(d.Asian)-5);
            }
    } else {    // transition the cy values
        if (dataColumn == "HaveHealthCare") {
            circles.transition().duration(1000).attr("cy", d => yScale(d.HaveHealthCare));
            texts.transition().duration(1000).attr("y", d => yScale(d.HaveHealthCare)+4);
        } else if (dataColumn == "HaveDepression") {
            circles.transition().duration(1000).attr("cy", d => yScale(d.HaveDepression));
            texts.transition().duration(1000).attr("y", d => yScale(d.HaveDepression)+4);
        } else if (dataColumn == "HaveAsthma") {
            circles.transition().duration(1000).attr("cy", d => yScale(d.HaveAsthma));
            texts.transition().duration(1000).attr("y", d => yScale(d.HaveAsthma)+4);
        }else {
            circles.transition().duration(1000).attr("cy", d => yScale(d.HaveArthritis));
            texts.transition().duration(1000).attr("y", d => yScale(d.HaveArthritis)+4);
        }
    }
};

function addChartTitle() {
    d3.select("#chartTitle").remove();

    var activeLabels = d3.selectAll(".labelbold");
    console.log(activeLabels);
    var titleText = activeLabels._groups[0][0].textContent + " who " + activeLabels._groups[0][1].textContent;
    console.log(titleText);

    svg.append("text")
        .attr("id", "chartTitle")
        .attr("x", (svgWidth / 2))             
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text(titleText);

}

// Load csv data and draw the chart
d3.csv("data/finalData.csv", function (error, healthData) {

    if (error) return console.warn(error);

    console.log(healthData);

    //cast the data from the csv as numbers
    healthData.forEach(function (data) {
        data.White = +data.White;
        data.AfricanAmerican = + data.AfricanAmerican;
        data.AmericanIndian = + data.AmericanIndian;
        data.Asian = + data.Asian;

        data.HaveHealthCare = +data.HaveHealthCare;
        data.HaveDepression = +data.HaveDepression;
        data.HaveAsthma = +data.HaveAsthma;
        data.HaveArthritis = +data.HaveArthritis;
    })
    console.log('data.White');
    createXAxis(healthData, "White");

    // Add x-axis label for White
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "White")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 75)
        .text("Caucasian")
        .classed("labelbold", true)
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring White click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "White");

                d3.select(this).classed("labelbold", true);
                d3.select("#AfricanAmerican").classed("labelbold", false);
                d3.select("#AmericanIndian").classed("labelbold", false);
                d3.select("#Asian").classed("labelbold", false);

                transitionCircles("x", "White");
                addChartTitle();
            }
        })
        .on("mouseover", function() {
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function() {
            d3.select(this).style("cursor", "default"); 
        });
   
    // Add x-axis label for AfricanAmerican
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "AfricanAmerican")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 90)
        .text("African American")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring AfricanAmerican click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "AfricanAmerican");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#White").classed("labelbold", false);
                d3.select("#AmericanIndian").classed("labelbold", false);
                d3.select("#Asian").classed("labelbold", false);

                transitionCircles("x", "AfricanAmerican");
                addChartTitle();
            }
        });

    // Add x-axis label for AmericanIndian
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "AmericanIndian")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 105)
        .text("American Indian")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring AmericanIndian click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "AmericanIndian");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#White").classed("labelbold", false);
                d3.select("#AfricanAmerican").classed("labelbold", false);
                d3.select("#Asian").classed("labelbold", false);

                transitionCircles("x", "AmericanIndian");
                addChartTitle();
            }
        });
   
    // Add x-axis label for Asian
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "Asian")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 120)
        .text("Asian")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring Asian click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "Asian");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#White").classed("labelbold", false);
                d3.select("#AfricanAmerican").classed("labelbold", false);
                d3.select("#AmericanIndian").classed("labelbold", false);


                transitionCircles("x", "Asian");
                addChartTitle();
            }
        });

    createYAxis(healthData, "HaveHealthCare");

    // Add y-axis label haveHealthCare
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "HaveHealthCare")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("HaveHealthCare")
        .classed("labelbold", true)
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring Have HealthCare click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "HaveHealthCare");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#HaveDepression").classed("labelbold", false);
                d3.select("#HaveAsthma").classed("labelbold", false);
                d3.select("#HaveArthritis").classed("labelbold", false);

                transitionCircles("y", "HaveHealthCare");
                addChartTitle();
            }
        });

    // Add y-axis label HaveDepression
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "HaveDepression")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 25)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("HaveDepression")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring HaveHealthCare click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "HaveDepression");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#HaveHealthCare").classed("labelbold", false);
                d3.select("#HaveAsthma").classed("labelbold", false);
                d3.select("#HaveArthritis").classed("labelbold", false);

                transitionCircles("y", "HaveDepression");
                addChartTitle();
            }
        });

    // Add y-axis label for HaveAsthma
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "HaveAsthma")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 45)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("HaveAsthma")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring HaveAsthma click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "HaveAsthma");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#HaveHealthCare").classed("labelbold", false);
                d3.select("#HaveDepression").classed("labelbold", false);
                d3.select("#HaveArthritis").classed("labelbold", false);

                transitionCircles("y", "HaveAsthma");
                addChartTitle();
            }
        });

    // Add y-axis label for HaveArthritis
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "HaveArthritis")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 65)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("HaveArthritis")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring HaveArthritis click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "HaveArthritis");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#HaveHealthCare").classed("labelbold", false);
                d3.select("#HaveDepression").classed("labelbold", false);
                d3.select("#HaveAsthma").classed("labelbold", false);

                transitionCircles("y", "HaveArthritis");
                addChartTitle();
            }
        });
    
    // Change the mousepointer when hovered over any of the labels to indicate that they
    // are clickable
    d3.selectAll(".label")
    .on("mouseover", function() {
        d3.select(this).style("cursor", "pointer"); 
    })
    .on("mouseout", function() {
        d3.select(this).style("cursor", "default"); 
    });

    // append circles - one for each data point
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.White))
        .attr("cy", d => yScale(d.HaveHealthCare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("stroke-width", "1")
        .attr("stroke", "black");
    
    // add the text on top of the circles
    var textGroup = chartGroup.selectAll("#circleText")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.stateAbbr)
        .attr("id", "circleText")
        .attr("x", d => xScale(d.White)-5)
        .attr("y", d => yScale(d.HaveHealthCare)+4)
        .attr("stroke-width", "1")
        .attr("fill", "black")
        .attr("font-size", 8);

    addChartTitle();


    // Initialize Tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d){
        var activeLabels = d3.selectAll(".labelbold");
        var labelx = activeLabels._groups[0][0].id;
        var labely = activeLabels._groups[0][1].id;
        
        var xValue = null;
        var yValue = null;

        switch(labelx) {
            case "White":
                xValue = d.White;
                break;        
            case "AfricanAmerican":
                xValue = d.AfricanAmerican;
                break;
            case "AmericanIndian":
                xValue = d.AmericanIndian;
                break;
            default:
                xValue = d.Asian;
                break;
        }
        
        switch(labely) {
            case "HaveHealthCare":
                yValue = d.HaveHealthCare;
                break;        
            case "HaveDepression":
                yValue = d.HaveDepression;
                break;
            case "HaveAsthma":
                yValue = d.HaveAsthma;
                break;
            default:
                yValue = d.HaveArthritis;
                break;
        }

        var tipText = `<strong>State:</strong> <span style='color:lightblue'>${d.State}</span><br>
            <strong>${labelx}:</strong> <span style='color:lightblue'>${xValue}</span><br>
            <strong>${labely}:</strong> <span style='color:lightblue'>${yValue}</span><br>`

        return tipText;

    });

    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d);
    })
    // Create "mouseout" event listener to hide tooltip
    .on("mouseout", function (d) {
        toolTip.hide(d);
    });

  
});

// Add the Chart Analysis description for the chart
var chartAnalysis = d3.select("#chartAnalysis")
    .append("text")
    .html(`<br>This visualization dashborad provides the information about the current trends that are shaping American's helath. 
    This graphs shows some of the cirtical healthrisks of American population seggragated by race.
    <br>
    Most of the americans irrespective of the race have health insurance coverage. 
    <br> <br>
    The above chart can be presented for variaous compbinations of the variables presented. clicking on the variable aligns the visualization 
    based on the selection.`);
