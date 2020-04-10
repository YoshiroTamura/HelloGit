  var svg;
  var svgWidth = 800;   //width
  var svgHeight = 800;   //height
  var rad = 200;
  var tradedata = new Array();
  var selecteddata = new Array();
  var totalValue = 0;
  var countryinfo;
  var currentCountryName;
  var commoditytext = new Object;
  var strDescription;
  var param = new Object;
  var FileDir = "csv/"
  var SessionFileName;
  var mode;
  var offsetY = 300;
  var cWindow;
  var piepalette = ["#0098DB","#FFFF00","#FFC0CB","#00FF00","#FFA500","#800080",
                    "#FF0000","#DCDCDC","#000080","#006400","#800000",
                    "#FF00FF","#808000","#FFFFFF","#00FA9A","#FFD700",
                    "#BA55D3","#FFFFE0","#FA8072","#E6E6FA","#A9A9A9"];



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

     mode = "I";

     queue()
        .defer(d3.csv, SessionFileName)
        .await(ready);

  }

  function ready(error, data) {

     if (!data[data.length-1].Country) {
        data.pop();
     }
     UniteTradeData(data);

  }

  var zoom = d3.zoom()
  .scaleExtent([1, 1])
  .on('zoom', function(){
     currentZoom = d3.event.transform.k;
     offsetX = d3.event.transform.x;
     offsetY = d3.event.transform.y;
console.log(d3.event.transform);
//     d3.select("#chart").attr("transform", d3.event.transform);
     d3.select("#layer").attr("transform", "translate(" + d3.event.transform.x + "," + (d3.event.transform.y) + ")");

  })


  function drawChart() {

     var rank;
     var cNo;


//     setTitle();
//alert(tradedata.length);

     if (tradedata.length == 0) {
        return 0;
     }

     svg = d3.select("body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", "svg")


     var arc = d3.arc()
            .outerRadius(rad)
            .innerRadius(80);

     var pie = d3.pie()
            .sort(null)
            .value(function(d) { 
               return d.Value;
            });

     var svg2 =  svg.append("svg")
     .style("background-color", "red")
     .style("overflow", "visible")
     .attr("y", offsetY)
     .call(zoom)



     var layer = svg2.append("g")
        .attr("id", "layer")
        .attr("transform", "translate(0,0)")

//        .attr("top", "100px")

     var chartElm = layer.append("g")
                       .attr("id", "chart")
                       .attr("transform", "translate(" + (rad + 30) + "," + (rad + 20 ) + ")");

     chartElm.selectAll("path")
        .data(pie(tradedata))
        .enter()
        .append("path")
        .style("stroke", "#c0c0c0")
        .style("stroke-width", "0.5")
        .style("fill", function(d,i) {
           return piepalette[d.data.ColorNo];
/*
           if (tradedata.length <= 10) {
              return d3.schemeCategory10[i];
           } else {
              return d3.schemeCategory20[i];
           }
*/
        })
        .transition()
        .duration(1000)
        .attrTween("d", function(d){
           var interpolate = d3.interpolate(
              { startAngle : 0, endAngle : 0 },
              { startAngle : d.startAngle, endAngle : d.endAngle }
           );
           return function(t){
              return arc(interpolate(t));
           };
        })


     chartElm
        .append("text")
        .text("BTP Sessions")
        .attr("text-anchor","middle")
        .attr("transform", "translate(0,-20)")
        .style("font-size","20px")
        .style("fill","#000000")

     chartElm
        .append("text")
        .text(function(d){
           return "Total";
        })
        .attr("text-anchor","middle")
        .attr("transform", "translate(0,0)")
        .style("font-size","20px")
        .style("fill","#000000")

     chartElm
        .append("text")
        .text(String(totalValue).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
        .attr("text-anchor","middle")
        .attr("transform", "translate(0,20)")
        .style("font-size","20px")
        .style("fill","#000000")

     var strSpan = "("+param["filename"].substr(0,param["filename"].length - 4)+")";

     chartElm
        .append("text")
        .text(strSpan)
        .attr("text-anchor","middle")
        .attr("transform", "translate(0,40)")
        .style("font-size","12px")
        .style("font-weight","bold")
        .style("fill","#000000")

     setLegend();

  }


  function UniteTradeData(rawdata) {

     var dNo = 0;
     var vshare;
     var uniteFlg = false;
     var addBwNo = 0;
     var pieNoMax = rawdata.length - 1;
     var cNo = 0, addNo;
     var sumValue = 0;

//alert(rawdata.length);
     for (var i = 0; i < rawdata.length; i++) {
        rawdata[i].Sessions = rawdata[i].Sessions.replace(/,/g, '');
        rawdata[i].Value = parseFloat(rawdata[i].Sessions);
        totalValue += rawdata[i].Value;
        selecteddata.push(rawdata[i]);
        sumValue += rawdata[i].Value;
//alert(rawdata[i].Value + "  " + sumValue);
     }

//alert(totalValue);

//alert(sumValue + " " + totalValue);

/*
     if (sumValue == totalValue) {
        //ok
     } else {
        addNo = selecteddata.length;
        selecteddata[addNo] = new Object;
        selecteddata[addNo].Value = totalValue - sumValue;
        selecteddata[addNo].Country = "Other";
     }
*/
     for (var i = 0; i < selecteddata.length; i++) {
        selecteddata[i].Value = parseFloat(selecteddata[i].Value);
        selecteddata[i].Share = selecteddata[i].Value / totalValue;

        if (uniteFlg == false
           && ((i > 8 && i < selecteddata.length - 2 && selecteddata[i].Share < 0.005) ||
                                              (i > 18 && selecteddata.length > 20))) {
           uniteFlg = true;
           pieNoMax = i;
        }
        if (uniteFlg == false) {
           tradedata[i] = copyObject(selecteddata[i]);
           tradedata[i].ColorNo = cNo;
           cNo++;
        } else {
           if (i == pieNoMax) {
              tradedata[pieNoMax] = copyObject(selecteddata[i]);
              tradedata[pieNoMax].Country = "Other";
              tradedata[pieNoMax].ColorNo = piepalette.length - 1;
           } else {
              tradedata[pieNoMax].Value += selecteddata[i].Value;
              tradedata[pieNoMax].Share += selecteddata[i].Share;
//console.log(selecteddata[i].CountryName+":"+selecteddata[i].Share+">>>"+tradedata[pieNoMax].Share);
           }
        }
     }

     for (i = 0; i < selecteddata.length; i++) {
console.log(selecteddata[i]);
     }


     drawChart();


  }

  function copyObject(sourceObj) {

     var myObj = new Object;

     for (key in sourceObj){
        myObj[key] = sourceObj[key];
     }
     return myObj;

  }


  function relateCountry(data) {

     for (var i = 0; i < countryinfo.length; i++) {
        if (countryinfo[i].ISO_A2 == data.ISO_A2) {
           data.CountryName = countryinfo[i].CountryName;
           data.Region = countryinfo[i].Region;
           data.SubRegion = countryinfo[i].SubRegion;
        }
     }
  }


  function setTitle() { 

     var strTitle = new Array();
     var nodataCountry = "";

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
              .html(function() {
                 if (i == 0) {
                    return strTitle[i] + "&nbsp;&nbsp;&nbsp;&nbsp;Year : " + param["year"]
                                                    + "&nbsp;&nbsp;&nbsp;&nbsp;" + currentCountryName;
                 } else {
                    return strTitle[i];
                 }
              })
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

     if (tradedata.length == 0) {

        var nodata = d3.select("body").append("div")
           .attr("id", "nodata")
           .attr("class", "nodata")
           .html("No Data")
     }


  }

  function openCompanyListWindow() {

     var wTop = 10;
     var wLeft = 50;
     var wWidth = 1080;
     var wHeight = 700;
     var strURL, strParam;

     if (cWindow && !cWindow.closed) {
        cWindow.close();
     }
     strParam = "?country=" + param["country"] + "&tradetype=" + mode + "&hscode=" + param["hscode"];
     strURL = "TradingCompanyList.html" + strParam;
     

     var wParam = "scrollbars=yes,resizable=no,toolbar=no,titlebar=no,menubar=no,location=no," +
                   "left="+wLeft+",top="+wTop+",width="+wWidth+",height="+wHeight;
     if (!cWindow || cWindow.closed) {
        cWindow=window.open(strURL,"",wParam);
     }
  }

  function setLegend() { 

     var rectWidth = 30;
     var rectHeight = 20;
     var textFontSize = 12;
     var bbox = new Array();
     var maxTextWidthC = 0;
     var maxTextWidthS = 0;
     var maxTextWidthV = 0;
     var cNo;

     if (tradedata.length >= 15) {
        rectHeight = 15;
     }

     var legend = d3.select("svg")
        .append("g")
        .attr("id","legend")
        .attr("transform", "translate("+(rad * 2 + 80)+"," + ((rad * 2 - (rectHeight + 5) * tradedata.length) / 2 + 20) + ")")

     var rect = d3.select("svg")
        .append("rect")
        .attr("class", "barlegend")
        .attr("width", svgWidth)
        .attr("height", 30)
        .attr("fill", "navy")


     var rank = legend.selectAll(".rank")
        .data(tradedata)
        .enter()
        .append("g")
        .attr("class", "rank")
        .attr("transform", function(d, i) {
           return "translate(0,"+i*(rectHeight+5)+")";
        })
        .style("font-weight", function(d) {
           return "normal";
        })

     rank
        .append("rect")
        .attr("width",rectWidth)
        .attr("height",rectHeight)
        .style("fill", function(d, i){
           return piepalette[d.ColorNo];
        })
        .style("stroke","#303030")
        .style("stroke-width",0.5);

     rank
        .append("text")
        .text(function(d) {
           return d.Country;
        })
        .attr("class","countryname")
        .style("font-size",function(d) {
           return textFontSize+"px";
        })
        .style("font-family","sans-serif")
        .style("fill","#000000")
        .each(function(d, i) {
           if (this.getBBox().width > maxTextWidthC) {
              maxTextWidthC = this.getBBox().width;
           }
        })

     rank.selectAll(".countryname")
        .attr("transform", function(d) {
           return "translate("+(rectWidth + 10)+"," + (rectHeight + textFontSize - 2) / 2 +")";
        })


     rank
        .append("text")
        .text(function(d) {
           return (String(d.Value).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
        })
        .attr("class","tradevalue")
        .style("font-size",textFontSize+"px")
        .style("font-family","sans-serif")
        .style("fill","#000000")
        .each(function(d, i) {
           d.bbox2 = this.getBBox();
           if (this.getBBox().width > maxTextWidthV) {
              maxTextWidthV = this.getBBox().width;
           }
        })

     rank.selectAll(".tradevalue")
        .attr("transform", function(d) {
           return "translate("+(rectWidth + 25 + maxTextWidthC + (maxTextWidthV - d.bbox2.width))+"," + (rectHeight + textFontSize - 2) / 2 + ")";
        })

     rank
        .append("text")
        .text(function(d) {
           if (d.Share  < 0.001) {
              return String((d.Share * 100).toFixed(2))+"%";
           } else {
              return String((d.Share * 100).toFixed(1))+"%";
           }
        })
        .attr("class","share")
        .style("font-size",textFontSize+"px")
        .style("font-family","sans-serif")
        .style("fill","#000000")
        .each(function(d, i) {
           d.bbox1 = this.getBBox();
           if (this.getBBox().width > maxTextWidthS) {
              maxTextWidthS = this.getBBox().width;
           }
        })

     rank.selectAll(".share")
        .attr("transform", function(d) {
           return "translate("+(rectWidth + 40 + maxTextWidthC + maxTextWidthV + (maxTextWidthS - d.bbox1.width))+"," + (rectHeight + textFontSize - 2) / 2 + ")";
        })
  }

  function exportCsvImportData() { 

     var i,j;
     var csv = new Array();
     var data;
     var filename;
     var column = { Year:'Year', Country:'Country', CountryName:'TargetCountryName', Partner:'PartnerCode', PartnerName:'CountryName', 
                    Region:'Region', SubRegion:'SubRegion', HS_Code:'HS_Code', Value:'Value', Share:'Share'};

     if (selecteddata.length == 0) {
        return 0;
     }

     filename = "Import_" + selecteddata[0].Country + "_" + selecteddata[0].HS_Code + "_" + selecteddata[0].Year + ".csv";

     i = 0;
     for (var key in column) {
        if (i == 0) {
           data = "";
        } else {
           data += ",";
        }
        data += "\"" + key + "\"";
        i++;
     }
     csv.push(data + "\n");

     for (i = 0; i < selecteddata.length; i++) {
        j = 0;
        for (var key in column) {
           if (j == 0) {
              data = "";
           } else {
              data += ",";
           }
//           if (key == "Partner" && selecteddata[i].Others == 1) {
//              data += "\"\"";
//           } else {
//           }
           data += "\"" + selecteddata[i][column[key]] + "\"";

           j++;
        }
        csv.push(data + "\n");
     }
     for (i = 0; i < csv.length; i++) {
//        console.log(csv[i]);
     }

     var blob = new Blob(csv, {type: "text/plain;charset=utf-8"});
     saveAs(blob, filename);
  }

  function exportCsvBotswanaExportData() {

     var i,j;
     var csv = new Array();
     var data;
     var filename;
     var column = ["Rank","Year","Partner","CountryName","HS_Code","Description","Export_Value","Region","SubRegion"];
/*
     var column = { Rank:'Rank', Year:'Year', Partner:'Partner'    CountryName:'TargetCountryName', Partner:'Partner', PartnerName:'CountryName', 
                    Region:'Region', SubRegion:'SubRegion', HS_Code:'HS_Code', Value:'Value', Share:'Share'};


     var column = { Year:'Year', Country:'Country', CountryName:'TargetCountryName', Partner:'Partner', PartnerName:'CountryName', 
                    Region:'Region', SubRegion:'SubRegion', HS_Code:'HS_Code', Value:'Value', Share:'Share'};
*/

     if (selecteddata.length == 0) {
        return 0;
     }

     filename = "BotswanaExport_" + selecteddata[0].HS_Code + "_" + selecteddata[0].Year + ".csv";

//console.log(selecteddata);

     for (i = 0; i < column.length; i++) {
        if (i == 0) {
           data = "";
        } else {
           data += ",";
        }
        data += "\"" + column[i] + "\"";
     }
     csv.push(data + "\n");

     for (j = 0; j < selecteddata.length; j++) {
        selecteddata[j].Rank  = j + 1;
        selecteddata[j].Description = strDescription;
        for (i = 0; i < column.length; i++) {
           if (i == 0) {
              data = "";
           } else {
              data += ",";
           }
           data += "\"" + selecteddata[j][column[i]] + "\"";
        }
        csv.push(data + "\n");
     }
     for (i = 0; i < csv.length; i++) {
        console.log(csv[i]);
     }

     var blob = new Blob(csv, {type: "text/plain;charset=utf-8"});

     saveAs(blob, filename);

  }

