  var svg;
  var svgWidth = 700;   //width
  var svgHeight = 400;   //height
  var svgTop;
  var svgLeft;
  var barHeight = svgHeight * 0.7;
  var barWidth = 40;
  var barPadding = 15;
  var LeftMargin = 80;
  var TopMargin = 50;
  var barchart;
  var barcolor = ["#009000","#900000"];
  var legendtext = ["Repeaters","New Users"];
  var strDescription;
  var FileDir = "csv/"
  var SessionFileName;// = "csv/BTP_UserActivity.csv?=" + new Date().getTime();
  var countryinfo;
  var usersession;
  var totalSessions = 0;
  var maxSessions = 0;
  var maxDuration = 0;
  var page = 1,bCnt = 10;
  var unit = 1;
  var topN = 6;
  var y, startScale, scalePitch = 2;
  var param = new Object;

  function initialize() {

     var kvArray = location.search.substring(1).split('&');
     var kv;

     for (var i = 0; i < kvArray.length; i++) {
        kv = kvArray[i].split('=')
        param[kv[0]] = kv[1];
     }
     
     if (param["filename"] == null) {
        return 0;
     }

     SessionFileName = FileDir + param["filename"];

     queue()
        .defer(d3.csv, SessionFileName)
        .await(ready);

//               d3.text("data_headless.csv", function(error, text) {
//    var data = d3.csv.parseRows(text);
//    console.log(data);


  }

  function ready(error, data) {

     usersession = data;
     if (!usersession[usersession.length-1].Country) {
        usersession.pop();
     }
     for (var i = 0; i < usersession.length; i++) {
        usersession[i].Sessions = usersession[i].Sessions.replace(/,/g, '');
        usersession[i]["New Users"] = usersession[i]["New Users"].replace(/,/g, '');
     }

for (i = 0; i < usersession.length; i++) {
console.log(usersession[i]["Avg. Session Duration"]);
}


     relateSessionCountry();
//     setImportFromWorld(param["hscode"],data3);

  }

  function changeTopN(n) {
     topN = n;
     relateCountry();
  }


  function setBarChartBaseNew() {

     var yUnit = "session duration";
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

     y = d3.scaleLinear()
                .rangeRound([barHeight, 0])
                .domain([0, maxDuration ]).nice();
//                .domain([0, Math.ceil(maxDuration / 60) * 60]).nice();

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
        .text("Average Session Duration")
        .attr("transform", "translate("+ (LeftMargin + ((barWidth + barPadding) * bCnt + barPadding) / 2) + "," + (TopMargin - 30) + ")")
        .style("font-size","18px");

     var strSpan = "("+param["filename"].substr(0,param["filename"].length - 4)+")";

     var chartSpan = svg.append("text")
        .attr("id", "chartspan")
        .attr("class", "chartspan")
        .attr("text-anchor","middle")
        .text(strSpan)
        .attr("transform", "translate("+ (LeftMargin + ((barWidth + barPadding) * bCnt + barPadding) / 2) + "," + (TopMargin - 12) + ")")
        .style("font-size","12px");

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
/*
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
*/

  }


  function setBarChartAxisNew() {

     d3.select("#barchart").remove()

     var yAxis = d3.axisLeft(y)
                    .tickSize(5)
                    .tickFormat(function(d){ return convertMS(d); })

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

  function convertMS(min) {
     
     var m,s;

     m = Math.floor(min);
     s = Math.round((min - m) * 60);

     return ("0"+m).slice(-2) + ":" + ("0"+s).slice(-2);

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
              .style("visibility", "hidden")
        })
        .on('dblclick', function (d) {
//           window.opener.openPieChartWindow(d.Country);
        })

     var barDuration = stackbar.append("rect")
        .attr("id", function(d,i) {
           return "bar"+i+"_topN_"+d.Country;
        })
        .attr("class", "bar")
        .attr("y", function(d){
           return (1 - (d["Duration"] / unit) / y.domain()[1]) * barHeight;
        })
        .attr("width", barWidth)
        .attr("height", function(d){
           return ((d["Duration"] / unit) / y.domain()[1]) * barHeight;
        })
        .attr("fill", barcolor[0])

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

  function relateSessionCountry() {

     totalSessions = d3.sum(usersession, function(d) {
        return parseFloat(d.Sessions);
     });


     for (var i = 0; i < usersession.length; i++) {
        usersession[i].Rank = i + 1;
        usersession[i].SessionTotal = parseFloat(usersession[i]["Sessions"]);
        usersession[i].SessionNew = parseFloat(usersession[i]["New Users"]);
        usersession[i].SessionRepeat = parseFloat(usersession[i]["Sessions"]) - parseFloat(usersession[i]["New Users"]);
        usersession[i].strDuration =  usersession[i]["Avg. Session Duration"];
        convertTime(usersession[i]);

//console.log(usersession[i].Duration);

        if (usersession[i].Duration && usersession[i].Duration > maxDuration) {
           maxDuration = usersession[i].Duration;
        }


//console.log(usersession[i]["Avg. Session Duration"] +  " "+usersession[i].Duration+" " + today);
        usersession[i].CountryName = usersession[i].Country;
        usersession[i].CountryNameR = usersession[i].Country.split(' ');
     }


     setBarChartBaseNew();
     setBarChartAxisNew()
     drawBarChartNew()
  }

  function convertTime(data) { 
     
     var c1,c2;
     c1 = data.strDuration.indexOf(":")
     if (c1 > 0) {
        c2 = data.strDuration.indexOf(":",c1+1);
        if (c2 > 0) {
           data.DurationHour = parseInt(data.strDuration.substr(0,c1));
           data.DurationMinute = parseInt(data.strDuration.substr(c1 + 1,c2 - c1 - 1));
           data.DurationSecond = parseInt(data.strDuration.substr(c2 + 1));
           data.Duration = (data.DurationHour * 3600 + data.DurationMinute * 60 + data.DurationSecond) / 60;
        }
     }
console.log(data.Duration + " " + data.DurationHour + " " + data.DurationMinute + " " + data.DurationSecond);

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
     var fltShare,strShare;

     fltShare = (d.SessionNew / d.SessionTotal) * 100;
     if (fltShare < 0.1) {
        strShare = String(fltShare.toFixed(2))+"%";
     } else {
        strShare = String(fltShare.toFixed(1))+"%";
     }
     strContent = durationContents;
     strContent = strContent.replace(RegExp("#country#","g"),d.Country);
     strContent = strContent.replace(RegExp("#duration#","g"),String(d.strDuration)); //.replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
     return strContent;

  }

  function setTooltipXY(tipXY, elementid) {

//alert(tipXY[0]);
//alert(elementid.substr(6));

//     var translatex = d3.select("#"+elementid).node().transform.baseVal[0].matrix.e;
     var translatex = (parseInt(elementid.substr(6)) * (barWidth + barPadding) + barPadding);

     d3.select("#importvalueTool")
        .style("left",function() {
           return (svgLeft + LeftMargin + translatex + tipXY[0] + 10) + "px";
        })
        .style("top",function() {
           return (svgTop + TopMargin + tipXY[1] - this.clientHeight - 10) + "px";
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


