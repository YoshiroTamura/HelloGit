  var svg;
  var svgWidth = 700;   //width
  var svgHeight = 400;   //height
  var svgTop;
  var svgLeft;
  var barHeight = svgHeight * 0.7;
  var barWidth = 40;
  var barPadding = 15;
  var LeftMargin = 80;
  var TopMargin = 40;
  var barchart;
  var barcolor = ["#006000","#900000"];
  var legendtext = ["Repeaters","New Users"];
  var strDescription;
  var ImportFileName = "csv/import/ImportWorld_year_hscode.csv?=" + new Date().getTime();
  var SessionFileName = "csv/BTP_UserActivity.csv?=" + new Date().getTime();
  var CommodityFileName = "csv/Commodity.csv?=" + new Date().getTime();
  var commoditytext = new Array;
  var countryinfo;
  var importfromworld;
  var totalImport = 0;
  var maxImport = 0;
  var usersession;
  var totalSessions = 0;
  var maxSessions = 0;
  var page = 1,bCnt = 10;
  var unit = 1;
  var topN = 6;
  var y, startScale, scalePitch = 2;
  var param = new Object;

  function initialize() {

     var kvArray = location.search.substring(1).split('&');
     var kv;

     param["year"]="2015";
     param["hscode"] = "00"

     var ImportFileNameYH = (ImportFileName.replace("year", param["year"])).replace("hscode", param["hscode"].substr(0,2));

     queue()
        .defer(d3.csv, SessionFileName)
        .await(ready);

  }

  function ready(error, data1, data2) {

     usersession = data1;

     relateSessionCountry();
//     setImportFromWorld(param["hscode"],data3);

  }

  function changeTopN(n) {
     topN = n;
     relateCountry();
  }

  function setBarChartBase() {

     var yUnit = "thousand U.S. Dollars";
     var i;
     var barLegend = new Array;
     var txt;

//     setTitle();

     d3.select("svg").remove()

     svg = d3.select("body").append("svg")
        .attr("id", "svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

     var svgRect = document.getElementById('svg').getBoundingClientRect();
     svgTop = svgRect.top;
     svgLeft = svgRect.left;

     var importvalueTool = d3.select("body").append("div")
        .attr("id", "importvalueTool")
        .attr("class", "importvalueTool")
        .style("position", "absolute")
        .style("background-color", "#ffffff")
        .style("border-radius", "3px")
        .style("border", "1px solid #c0c0c0")
        .style("opacity", "0.8")

     if (maxImport >= 10000000) {
        unit = 1000000;
        yUnit = "billion U.S. Dollars";
     } else if (maxImport >= 10000) {
        unit = 1000;
        yUnit = "million U.S. Dollars";
     }

     y = d3.scaleLinear()
                .rangeRound([barHeight, 0])
                .domain([0, maxImport/unit]).nice();

     startScale = y.domain()[1];

     var unitText = svg.append("text")
        .attr("class", "tick")
        .attr("text-anchor","middle")
        .text(yUnit)
        .attr("transform", "translate(" + LeftMargin + "," + (TopMargin - 15) + ")")

     var chartTitle = svg.append("text")
        .attr("id", "charttitle")
        .attr("class", "charttitle")
        .attr("text-anchor","middle")
        .text("New Users Rate")
        .attr("transform", "translate("+ (LeftMargin + ((barWidth + barPadding) * bCnt + barPadding) / 2) + "," + TopMargin + ")")
        .style("font-size","18px");

     var rankUp = d3.select("body").append("div")
        .attr("id", "rankup")
        .attr("class", "rank")
        .style("top", (svgTop + barHeight + TopMargin + 10) + "px")
        .style("left", "20px")
        .html("<")
        .on("click", function(d) {
           page--;
           drawBarChart();
        })

     var rankDown = d3.select("body").append("div")
        .attr("id", "rankdown")
        .attr("class", "rank")
        .style("top", (svgTop + barHeight + TopMargin + 10) + "px")
        .style("left", (barWidth + barPadding) * bCnt + barPadding + LeftMargin + 20 + "px")
        .html(">")
        .on("click", function(d) {
           page++;
           drawBarChart();
        })

     var scaleUp = d3.select("body").append("div")
        .attr("id", "scaleup")
        .attr("class", "barscale")
        .style("top", (svgTop + TopMargin + barHeight * 0.25) + "px")
        .style("left", "15px")
        .html("+")
        .on("click", function(d) {
           y.domain([0, y.domain()[1] / scalePitch]);
           setBarChartAxis();
           drawBarChart();
        })

     var scaleDown = d3.select("body").append("div")
        .attr("id", "scaledown")
        .attr("class", "barscale")
        .style("top", (svgTop + TopMargin + barHeight * 0.75) + "px")
        .style("left", "15px")
        .html("-")
        .on("click", function(d) {
           y.domain([0, y.domain()[1] * scalePitch]);
           setBarChartAxis();
           drawBarChart();
        })

     var graphLegend = svg.append("g")
        .attr("class", "graphlegend")
        .attr("transform", "translate(" +  (svgWidth - 100) + ",5)");

     for (i = 0; i < 2; i++) {
        txt = legendtext[i].split(",");
        barLegend[i] = graphLegend.append("g")
          .attr("id", "barlegend"+i)
          .attr("transform", "translate(0," + (i*18) + ")")
          .style("visibility", function(){
             if (i == 2 && topN == 0) {
                return "hidden";
             } else {
                return "visible";
             }
          });

        barLegend[i].append("rect")
          .attr("class", "barlegend")
          .attr("width", 25)
          .attr("height", 15)
          .attr("fill", barcolor[i])

        for (j = 0; j < txt.length; j++) {
           barLegend[i].append("text")
             .attr("class", "barlegendtext")
             .attr("transform", function() {
                if (txt.length == 1) {
                   return "translate(30,12)";
                } else {
                   if (j == 0) {
                      return "translate(30,8)";
                   } else {
                      return "translate(40,20)";
                   }
                }
             })
             .text(txt[j])
             .style("font-size","10px")
             .style("font-weight","normal")
             .style("fill","#000")
        }
     }


  }

  function setBarChartBaseNew() {

     var yUnit = "sessions";
     var i;
     var barLegend = new Array;
     var txt;

     d3.select("svg").remove()

     svg = d3.select("body").append("svg")
        .attr("id", "svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

     var svgRect = document.getElementById('svg').getBoundingClientRect();
     svgTop = svgRect.top;
     svgLeft = svgRect.left;

     var importvalueTool = d3.select("body").append("div")
        .attr("id", "importvalueTool")
        .attr("class", "importvalueTool")
        .style("position", "absolute")
        .style("background-color", "#ffffff")
        .style("border-radius", "3px")
        .style("border", "1px solid #c0c0c0")
        .style("opacity", "0.8")

     unit = 1;
     yUnit = "sessions";

     y = d3.scaleLinear()
                .rangeRound([barHeight, 0])
                .domain([0, maxSessions]).nice();

     startScale = y.domain()[1];

     var unitText = svg.append("text")
        .attr("class", "tick")
        .attr("text-anchor","middle")
        .text(yUnit)
        .attr("transform", "translate(" + LeftMargin + "," + (TopMargin - 15) + ")")

     var chartTitle = svg.append("text")
        .attr("id", "charttitle")
        .attr("class", "charttitle")
        .attr("text-anchor","middle")
        .text("New Users Rate")
        .attr("transform", "translate("+ (LeftMargin + ((barWidth + barPadding) * bCnt + barPadding) / 2) + "," + TopMargin + ")")
        .style("font-size","18px");

     var rankUp = d3.select("body").append("div")
        .attr("id", "rankup")
        .attr("class", "rank")
        .style("top", (svgTop + barHeight + TopMargin + 10) + "px")
        .style("left", "20px")
        .html("<")
        .on("click", function(d) {
           page--;
           drawBarChartNew();
        })

     var rankDown = d3.select("body").append("div")
        .attr("id", "rankdown")
        .attr("class", "rank")
        .style("top", (svgTop + barHeight + TopMargin + 10) + "px")
        .style("left", (barWidth + barPadding) * bCnt + barPadding + LeftMargin + 20 + "px")
        .html(">")
        .on("click", function(d) {
           page++;
           drawBarChartNew();
        })

     var scaleUp = d3.select("body").append("div")
        .attr("id", "scaleup")
        .attr("class", "barscale")
        .style("top", (svgTop + TopMargin + barHeight * 0.25) + "px")
        .style("left", "15px")
        .html("+")
        .on("click", function(d) {
           y.domain([0, y.domain()[1] / scalePitch]);
           setBarChartAxisNew();
           drawBarChartNew();
        })

     var scaleDown = d3.select("body").append("div")
        .attr("id", "scaledown")
        .attr("class", "barscale")
        .style("top", (svgTop + TopMargin + barHeight * 0.75) + "px")
        .style("left", "15px")
        .html("-")
        .on("click", function(d) {
           y.domain([0, y.domain()[1] * scalePitch]);
           setBarChartAxisNew();
           drawBarChartNew();
        })

     var graphLegend = svg.append("g")
        .attr("class", "graphlegend")
        .attr("transform", "translate(" +  (svgWidth - 100) + ",5)");

     for (i = 0; i < 2; i++) {
        txt = legendtext[i].split(",");
        barLegend[i] = graphLegend.append("g")
          .attr("id", "barlegend"+i)
          .attr("transform", "translate(0," + (i*18) + ")")
          .style("visibility", function(){
             if (i == 2 && topN == 0) {
                return "hidden";
             } else {
                return "visible";
             }
          });

        barLegend[i].append("rect")
          .attr("class", "barlegend")
          .attr("width", 25)
          .attr("height", 15)
          .attr("fill", barcolor[i])

        for (j = 0; j < txt.length; j++) {
           barLegend[i].append("text")
             .attr("class", "barlegendtext")
             .attr("transform", function() {
                if (txt.length == 1) {
                   return "translate(30,12)";
                } else {
                   if (j == 0) {
                      return "translate(30,8)";
                   } else {
                      return "translate(40,20)";
                   }
                }
             })
             .text(txt[j])
             .style("font-size","10px")
             .style("font-weight","normal")
             .style("fill","#000")
        }
     }


  }

  function setBarChartAxis() {

     d3.select("#barchart").remove()

     var yAxis = d3.axisLeft(y)
                    .tickSize(5)

     barchart = svg.append("g")
        .attr("id", "barchart")
        .attr("transform", "translate(" + LeftMargin + "," + TopMargin + ")")

     barchart.append("g")
        .attr("class", "axis axis-y")
        .call(yAxis)

     barchart.append("rect")
        .attr("class", "axis axis-x")
        .attr("width", (barWidth + barPadding)*bCnt+barPadding)
        .attr("height", 1)
        .attr("transform", "translate(0," + barHeight + ")")

     d3.selectAll(".tick")
        .style("font-size","10px");



  }

  function setBarChartAxisNew() {

     d3.select("#barchart").remove()

     var yAxis = d3.axisLeft(y)
                    .tickSize(5)

     barchart = svg.append("g")
        .attr("id", "barchart")
        .attr("transform", "translate(" + LeftMargin + "," + TopMargin + ")")

     barchart.append("g")
        .attr("class", "axis axis-y")
        .call(yAxis)

     barchart.append("rect")
        .attr("class", "axis axis-x")
        .attr("width", (barWidth + barPadding)*bCnt+barPadding)
        .attr("height", 1)
        .attr("transform", "translate(0," + barHeight + ")")

     d3.selectAll(".tick")
        .style("font-size","10px");

  }

  function drawBarChart() {

     d3.selectAll(".xlabel").remove();
     d3.selectAll(".stackbar").remove();

     barchart.selectAll("xlabel")
        .data(importfromworld.filter(function(d) {
           return d.Rank > (page - 1) * bCnt && d.Rank <= page * bCnt;
        }))
        .enter()
        .append("g")
        .attr("id", function(d) {
           return "xlabel-"+d.Country;
        })
        .attr("class", "xlabel")
        .attr("text-anchor","middle")
        .attr("transform", function(d, i) {
           return "translate(" + (barPadding + i * (barWidth + barPadding) + barWidth * 0.5) + ","+ (barHeight + 15) +")";
        })
        .style("font-size", "10px")
        .append("text")
        .text(function(d) {
           return "#" + d.Rank;
        })
        .each(function(d) {
           for (var i = 0; i < d.CountryNameR.length; i++) {
//              barchart.select("#xlabel-"+d.Country)
              d3.select(this.parentNode)
                 .append("text")
                 .text(d.CountryNameR[i])
                 .attr("transform", "translate(0," + (i*10+10)  + ")");
           }

        })

     var stackbar = barchart.selectAll("stackbar")
        .data(importfromworld.filter(function(d) {
           return d.Rank > (page - 1) * bCnt && d.Rank <= page * bCnt;
        }))
        .enter()
        .append("g")
        .attr("id", function(d, i) {
           return "bargrp"+i;
        })
        .attr("class", "stackbar")
        .attr("transform", function(d, i) {
           return "translate(" + (i * (barWidth + barPadding) + barPadding) + ",0)";
        })
        .on('mouseover', function (d) {
           d3.select("#importvalueTool")
              .html(setTooltipContent(d,unit))
              .style("visibility", "visible")
        })
        .on('mousemove', function (d) {
           setTooltipXY([d3.mouse(this)[0],d3.mouse(this)[1]],this.id);
        })
        .on('mouseout', function (d) {
           d3.select("#importvalueTool")
//              .style("visibility", "hidden")
        })
        .on('dblclick', function (d) {
           window.opener.openPieChartWindow(d.Country);
        })

     var barWorld = stackbar.append("rect")
        .attr("id", function(d,i) {
           return "bar"+i+"_"+d.Country;
        })
        .attr("class", "bar")
        .attr("y", function(d){
           return (1 - ((d.ValueFromWorld - d.ValueFromBotswana) / unit) / y.domain()[1]) * barHeight;
        })
        .attr("width", barWidth)
        .attr("height", function(d){
           return (((d.ValueFromWorld - d.ValueFromBotswana - d.ValueFromTopN) / unit) / y.domain()[1]) * barHeight;
        })
        .attr("fill", barcolor[0])

     var barTopN = stackbar.append("rect")
        .attr("id", function(d,i) {
           return "bar"+i+"_topN_"+d.Country;
        })
        .attr("class", "bar")
        .attr("y", function(d){
           return (1 - (d.ValueFromTopN / unit) / y.domain()[1]) * barHeight;
        })
        .attr("width", barWidth)
        .attr("height", function(d){
           return ((d.ValueFromTopN / unit) / y.domain()[1]) * barHeight;
        })
        .attr("fill", barcolor[1])

     var barBotswana = stackbar.append("rect")
        .attr("id", function(d,i) {
           return "bar"+i+"_bw_"+d.Country;
        })
        .attr("class","bar")
        .attr("y", function(d){
           return (1 - (d.ValueFromWorld / unit) / y.domain()[1]) * barHeight;
        })
        .attr("width", barWidth)
        .attr("height", function(d){
           return ((d.ValueFromBotswana / unit) / y.domain()[1]) * barHeight;
        })
        .attr("fill", barcolor[0])
//alert("2");

     d3.select("#rankup")
        .style("display", function(d) {
           if (page <= 1) {
              return "none";
           } else {
              return "block";
           }
        });

     d3.select("#rankdown")
        .style("display", function(d) {
           if (page * bCnt >= importfromworld.length) {
              return "none";
           } else {
              return "block";
           }
        });

  }

  function drawBarChartNew() {

     d3.selectAll(".xlabel").remove();
     d3.selectAll(".stackbar").remove();

     barchart.selectAll("xlabel")
        .data(usersession.filter(function(d) {
           return d.Rank > (page - 1) * bCnt && d.Rank <= page * bCnt;
        }))
        .enter()
        .append("g")
        .attr("id", function(d) {
           return "xlabel-"+d.Country;
        })
        .attr("class", "xlabel")
        .attr("text-anchor","middle")
        .attr("transform", function(d, i) {
           return "translate(" + (barPadding + i * (barWidth + barPadding) + barWidth * 0.5) + ","+ (barHeight + 15) +")";
        })
        .style("font-size", "10px")
        .append("text")
        .text(function(d) {
           return "#" + d.Rank;
        })
        .each(function(d) {
           for (var i = 0; i < d.CountryNameR.length; i++) {
//              barchart.select("#xlabel-"+d.Country)
              d3.select(this.parentNode)
                 .append("text")
                 .text(d.CountryNameR[i])
                 .attr("transform", "translate(0," + (i*10+10)  + ")");
           }

        })

     var stackbar = barchart.selectAll("stackbar")
        .data(usersession.filter(function(d) {
           return d.Rank > (page - 1) * bCnt && d.Rank <= page * bCnt;
        }))
        .enter()
        .append("g")
        .attr("id", function(d, i) {
           return "bargrp"+i;
        })
        .attr("class", "stackbar")
        .attr("transform", function(d, i) {
           return "translate(" + (i * (barWidth + barPadding) + barPadding) + ",0)";
        })
        .on('mouseover', function (d) {
           d3.select("#importvalueTool")
              .html(setTooltipContent(d,unit))
              .style("visibility", "visible")
        })
        .on('mousemove', function (d) {
           setTooltipXY([d3.mouse(this)[0],d3.mouse(this)[1]],this.id);
        })
        .on('mouseout', function (d) {
           d3.select("#importvalueTool")
//              .style("visibility", "hidden")
        })
        .on('dblclick', function (d) {
           window.opener.openPieChartWindow(d.Country);
        })

     var barRepeat = stackbar.append("rect")
        .attr("id", function(d,i) {
           return "bar"+i+"_"+d.Country;
        })
        .attr("class", "bar")
        .attr("y", function(d){
           return (1 - ((d["Sessions"] - d["New Users"]) / unit) / y.domain()[1]) * barHeight;
        })
        .attr("width", barWidth)
        .attr("height", function(d){
           return (((d["Sessions"] - d["New Users"]) / unit) / y.domain()[1]) * barHeight;
        })
        .attr("fill", barcolor[0])

     var barNew = stackbar.append("rect")
        .attr("id", function(d,i) {
           return "bar"+i+"_topN_"+d.Country;
        })
        .attr("class", "bar")
        .attr("y", function(d){
           return (1 - (d["New Users"] / unit) / y.domain()[1]) * barHeight;
        })
        .attr("width", barWidth)
        .attr("height", function(d){
           return ((d["New Users"] / unit) / y.domain()[1]) * barHeight;
        })
        .attr("fill", barcolor[1])

     d3.select("#rankup")
        .style("display", function(d) {
           if (page <= 1) {
              return "none";
           } else {
              return "block";
           }
        });

     d3.select("#rankdown")
        .style("display", function(d) {
           if (page * bCnt >= usersession.length - 1) {
              return "none";
           } else {
              return "block";
           }
        });

  }

  function setImportFromWorld(hscode, data) {

     var i;
     var n = 0;
     var txtOption = "";

     importfromworld = new Array();

     for (i = 0; i < data.length; i++) {
        if (data[i].HS_Code == hscode) {
           importfromworld.push(data[i]);
        }
     }
     relateCountry();

  }


  function relateSessionCountry() {

     totalSessions = d3.sum(usersession, function(d) {
        return parseFloat(d.Sessions);
     });
     maxSessions = d3.max(usersession, function(d) {
        return parseFloat(d.Sessions);
     });

     for (var i = 0; i < usersession.length; i++) {
        usersession[i].Rank = i + 1;
        usersession[i].SessionNew = parseFloat(usersession[i]["New Users"]);
        usersession[i].SessionRepeat = parseFloat(usersession[i]["Sessions"]) - parseFloat(usersession[i]["New Users"]);
        usersession[i].CountryName = usersession[i];
        usersession[i].CountryNameR = usersession[i].Country.split(' ');
     }

     setBarChartBaseNew();
     setBarChartAxisNew()
     drawBarChartNew()
  }

  function relateCountry() {

     var Values = new Array;

     totalImport = d3.sum(importfromworld, function(d) {
        return parseFloat(d.ValueFromWorld);
     });
     maxImport = d3.max(importfromworld, function(d) {
        return parseFloat(d.ValueFromWorld);
     });

//alert(importfromworld.length);

     for (var i = 0; i < importfromworld.length; i++) {
        importfromworld[i].Rank = i + 1;
        importfromworld[i].ValueFromWorld = parseFloat(importfromworld[i].ValueFromWorld);
        importfromworld[i].ValueFromTopN = 0; //(importfromworld[i].ValueFromWorld-importfromworld[i].ValueFromBotswana)*0.3;
        if (importfromworld[i].Values_Top10.length > 0) {
           Values = importfromworld[i].Values_Top10.split(",");
//console.log(Values +"   "+ Values.length);

           for (var j = 0; j < Values.length; j++) {
              if (j < topN) {
                 importfromworld[i].ValueFromTopN += parseFloat(Values[j]);
              }
           }
        }
        if (isNaN(importfromworld[i].ValueFromWorld)) {
           importfromworld[i].ValueFromWorld = 0;
        }
        importfromworld[i].ValueFromBotswana = parseFloat(importfromworld[i].ValueFromBotswana);
        if (isNaN(importfromworld[i].ValueFromBotswana)) {
           importfromworld[i].ValueFromBotswana = 0;
        }
        if (importfromworld[i].ValueFromWorld > 0) {
           importfromworld[i].ShareofTopN = importfromworld[i].ValueFromTopN / importfromworld[i].ValueFromWorld;
           importfromworld[i].ShareofBotswana = importfromworld[i].ValueFromBotswana / importfromworld[i].ValueFromWorld;
        } else {
           importfromworld[i].ShareofTopN = 0;
           importfromworld[i].ShareofBotswana = 0;
        }

        for (var j = 0; j < countryinfo.length; j++) {
           if (countryinfo[j].ISO_A2 == importfromworld[i].Country) {
              importfromworld[i].CountryName = countryinfo[j].CountryName;
              importfromworld[i].CountryNameR = countryinfo[j].CountryName.split(' ');
              importfromworld[i].Region = countryinfo[j].Region;
              importfromworld[i].SubRegion = countryinfo[j].SubRegion;
           }
        }
     }
     setBarChartBase();
     setBarChartAxis()
     drawBarChart()
//console.log(importfromworld);
//console.log(maxImport);
  }

  function getCommodityText(data) {

     commoditytext.chapter = "";
     commoditytext.heading = "";
     commoditytext.subheading = "";

     for (var i = 0; i < data.length; i++) {
        if (data[i]["HS_Code"].length == 6) {  
           if (data[i]["HS_Code"] == param["hscode"]) {
              commoditytext.subheading = data[i].Description;
           }
        } else if (data[i]["HS_Code"].length == 4) { 
           if (data[i]["HS_Code"] == param["hscode"].substr(0,4)) {
              commoditytext.heading = data[i].Description;
           }
        } else if (data[i]["HS_Code"].length == 2) { 
           if (data[i]["HS_Code"] == param["hscode"].substr(0,2)) {
              commoditytext.chapter = data[i].Description;
           }
        }
     }

//alert(commoditytext.subheading);

  }

  function setTitle() { 

     d3.selectAll(".title").remove();

     var strTitle = new Array();

     if (param["hscode"] == '00') {
        strTitle[0] = "All Commodities Total";
     } else {
        strTitle[0] = "HS CODE : " + param["hscode"];
     }

     strTitle[1] = commoditytext.chapter;
     strTitle[2] = commoditytext.heading;
     strTitle[3] = commoditytext.subheading;

     for (var i = 0; i < strTitle.length; i++) {
        if (strTitle[i].length > 0) {
           d3.select("body").append("div")
              .attr("id", "title"+i)
              .attr("class", "title")
              .html(strTitle[i])
              .style("width", "600px")
              .style("padding","3px 20px")
              .style("font-size",function() {
                 if (i == 0) {
                    return "16px";
                 } else if (strTitle[1].length < 50 && strTitle[2].length < 50 && strTitle[3].length < 50) {
                    return "14px";
                 } else if (strTitle[1].length < 100 && strTitle[2].length < 100 && strTitle[3].length < 100) {
                    return "12px";
                 } else {
                    return "10px";
                 }
              })
              .style("font-family","sans-serif")
              .style("fill","#000000")
           strDescription = strTitle[i];
        }
     }

     strTitle[0] += "&nbsp;&nbsp;&nbsp;&nbsp;Year : " + param["year"];

  }

  function setTooltipContent(d,unit) {

     var strContent = "";

     strContent = importvalueContents;
     strContent = strContent.replace(RegExp("#country#","g"),d.CountryName);
     strContent = strContent.replace(RegExp("#valuefromworld#","g"),String(d.ValueFromWorld).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
     strContent = strContent.replace(RegExp("#valuefromtopn#","g"),String(d.ValueFromTopN).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
     strContent = strContent.replace(RegExp("#topn#","g"),topN);
     strContent = strContent.replace(RegExp("#valuefrombotswana#","g"),String(d.ValueFromBotswana).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
     if (topN == 0 || d.ValueFromTopN == 0) {
        strContent = strContent.replace("#displaytopn#","style='display:none;'");
     } else {
        strContent = strContent.replace("#displaytopn#","");
     }
     return strContent;

  }

  function setTooltipXY(tipXY, elementid) {

     var translatex = d3.select("#"+elementid).node().transform.baseVal[0].matrix.e;

     d3.select("#importvalueTool")
        .style("left",function() {
           return (svgLeft + 50 + translatex + tipXY[0] + 10) + "px";
        })
        .style("top",function() {
           return (svgTop + 40 + tipXY[1] - this.clientHeight - 10) + "px";
        })

  }

  function exportCsvWorldImport() { 

     var i,j;
     var csv = new Array();
     var data;
     var filename;
     var column = ["Rank","Year","Country","CountryName","Region","SubRegion","HS_Code","Description","ValueFromWorld","ValueFromTopN","ValueFromBotswana","ShareofTopN","ShareofBotswana"];

     if (importfromworld.length == 0) {
        return 0;
     }

//console.log(importfromworld);

     filename = "WorldImport_" + importfromworld[0].HS_Code + "_" + importfromworld[0].Year  + ".csv";

     for (i = 0; i < column.length; i++) {
        if (i == 0) {
           data = "";
        } else {
           data += ",";
        }
        data += "\"" + column[i].replace("TopN","Top"+topN) + "\"";
     }
     csv.push(data + "\n");

     for (j = 0; j < importfromworld.length; j++) {
        importfromworld[j].Description = strDescription;
        for (i = 0; i < column.length; i++) {
           if (i == 0) {
              data = "";
           } else {
              data += ",";
           }
           data += "\"" + importfromworld[j][column[i]] + "\"";
        }
        csv.push(data + "\n");
     }
     for (i = 0; i < csv.length; i++) {
        console.log(csv[i]);
     }

     var blob = new Blob(csv, {type: "text/plain;charset=utf-8"});
     saveAs(blob, filename);

  }


