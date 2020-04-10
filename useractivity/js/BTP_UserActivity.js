  var mapLayer;
  var svg;
  var mapScaleBase = 300;  //map scale base
  var mapScale = 180;  //map scale
  var mapWidth = 1100;   //width
  var mapHeight = 520;   //height
  var mapTop = 0;
  var mapPath, mapBounds, mapCenter;
//  var colorLand = d3.interpolateHsl("#f5f5dc","#800000");
  var colorLand = d3.interpolateHslLong("#ffff30","#0030f0");
  var baseRad = 1.0;
  var countryInfo = new Array();
  var cborder,dborder,cborder2;
  var usersession;
  var borderWidthBase = 1.0, borderWidthCircle = 0.5;
  var totalValue = 0;
  var maxValue = 0;
  var minValue = 1.0e+12;
  var currentZoom = 1;
  var offsetX = 0, offsetY = 0;
  var iniZoom = 2;
  var page = 1,rCnt = 10;
  var jsonCountryFileName = "json/WorldCountry_Btp.json?=" + new Date().getTime();
  var countryInfoFileName = "csv/CountryName.txt?=" + new Date().getTime();
  var notRelatedCounty = new Array();
  var FileDir = "csv/"
  var ListFileName = "FileList.txt?=" + new Date().getTime();
  var cWindowP,cWindowB1,cWindowB2,cWindowC;

  window.onunload = function(){
     if (cWindowP && !cWindowP.closed) {
        cWindowP.close();
     }
     if (cWindowB1 && !cWindowB1.closed) {
        cWindowB1.close();
     }
     if (cWindowB2 && !cWindowB2.closed) {
        cWindowB2.close();
     }
  }

  function initialize() {

     queue()
        .defer(d3.json, jsonCountryFileName)
        .defer(d3.text, countryInfoFileName)
        .defer(d3.text, FileDir + ListFileName)
        .await(ready);
  }

  function ready(error, data1, data2, data3) {

     if (error) {
        alert("File list is not exist");
     }

     cborder = data1;
     var crows = d3.csvParseRows(data2);
     getCountryInfo(crows);
     for (i = 0; i < countryInfo.length; i++) {
//console.log(countryInfo[i].ISO_A2+">>>"+countryInfo[i].CountryName);
     }

     var rows = d3.csvParseRows(data3);
     setFileName(rows);

  }

  function getCountryInfo(list) {
     for (var i = 0; i < list.length; i++) {
        countryInfo.push({"ISO_A2":list[i][0],"CountryName":list[i][1]});
     }
  }

  function setFileName(list) {

//console.log(list.length);

     var i;
     var txtOption = "";
     var fld = document.getElementById('f_FileName');

     for (i = 0; i < list.length; i++) {
        txtOption += "<option value='"+list[i][0]+"'";
        if (i == list.length - 1) {
           txtOption += " SELECTED";
        }
        txtOption += ">"+list[i][0]+"</option>"
     }
     fld.innerHTML = txtOption;
     readFile(fld.value)

  }

  function readFile(filename) {

     if (!filename) {
        return 0
     }

     queue()
        .defer(d3.csv, FileDir + filename)
        .await(function(error, data) {
           if (error) {
              throw error;
           } else {
             usersession = data;
             if (!usersession[usersession.length-1].Country) {
                usersession.pop();
             }
             for (var i = 0; i < usersession.length; i++) {
                usersession[i].Sessions = usersession[i].Sessions.replace(/,/g, '');
                usersession[i]["New Users"] = usersession[i]["New Users"].replace(/,/g, '');
             }
//             console.log(usersession);
             drawMap();
           }
        });

  }

  function setmenu(data) {
  
     var menucolumn = new Array();
     var menuflg = false;

     for (key in data[0]){
        if (menuflg) {
           menucolumn.push(key)
        }
        if (key == "Sessions") {
           menuflg = true;
        }
     }

     for (var i = 0; i < menucolumn.length; i++) {
        console.log(menucolumn[i]);
     }
  }

  function drawMap() {

     mapCenter = [10, 10];

     mapPath = d3.geoPath()
         .projection(d3.geoMercator()
           .center(mapCenter)
           .translate([mapWidth/2, mapHeight/2])
           .scale(mapScale)
         );

     d3.select("svg")
       .remove()

     mapTop = document.getElementById("top_bar").clientHeight;

     svg = d3.select("body").append("svg")
        .attr("id", "svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .style("overflow", "hidden")
        .call(zoom)

     svg.append("rect")
        .attr("id","sea")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height",mapHeight)
        .attr("width",mapWidth)
        .style("stroke","none")

     mapLayer = svg.append("g")
        .attr("id", "mapLayer")
        .style("fill", function(d,i) {
              return "#ffffff";
        })

     mapLayer.selectAll(".countryborder")
        .data(cborder.features)
        .enter()
        .append("path")
        .attr("d", mapPath)
        .attr("id", "countryborder")
        .attr("id", function(d,i) {
           return "countryborder" + i;
        })
        .attr("class", "countryborder")
        .style("fill", function(d,i) {
//           if (d.properties.countryname == "Botswana") {
//              return "#0098db";
//           } else {
              return "#ffffff";
//           }
        })
        .style("fill-opacity",0.8)
        .style("stroke", "#c0c0c0")
        .style("stroke-width", "1")
        .style("stroke-opacity",1)
        .on('mousedown', function(d) {
           curText = d.properties.countryname;
           SetTooltip([d3.mouse(this)[0],d3.mouse(this)[1]],[curText],d.properties.rank);
        })
        .on('mouseup', function() {

//           var tooltip = mapLayer.select(".tooltip");
//           if(!tooltip.empty()) {
//              tooltip.style("visibility", "hidden");
//           }
//alert("mouseup");
        })
        .each(function(d) {
//           console.log(d.properties.countryname+":"+d.properties.subregion);
        });

     var Legend = d3.select("body").append("div")
        .attr("id", "legend")
        .attr("class", "legend")
        .style("position", "absolute")

     var sessioncountryTool = d3.select("body").append("div")
        .attr("id", "sessioncountryTool")
        .attr("class", "sessioncountryTool")
        .style("position", "absolute")
        .style("background-color", "#e0fff0")
        .style("border-radius", "3px")
        .style("opacity", "1.0")

//     paintBackGround("#f0f9ff");
     paintBackGround("#ffffff");

   //   var zoomIn = d3.select("body").append("div")
   //      .attr("id", "zoomin")
   //      .attr("class", "zoom")
   //      .style("top", "100px")
   //      .style("left", "20px")
   //      .html("+")
   //      .on("click", function(d) {
   //         zoom.scaleTo(svg,currentZoom*1.6);
   //      })

   //   var zoomOut = d3.select("body").append("div")
   //      .attr("id", "zoomout")
   //      .attr("class", "zoom")
   //      .style("top", "135px")
   //      .style("left", "20px")
   //      .html("-")
   //      .on("click", function(d) {
   //         zoom.scaleTo(svg, currentZoom*0.625);
   //      })


     drawMapSessionCountry();

  }

  var zoom = d3.zoom()
     .scaleExtent([1, 40])
     .on('zoom', function(){
        currentZoom = d3.event.transform.k;
//console.log(currentZoom);
        offsetX = d3.event.transform.x;
        offsetY = d3.event.transform.y;
//console.log(offsetX + " ----- " + offsetY);
        mapLayer.attr("transform", d3.event.transform);
        mapLayer.selectAll(".countryborder")
           .style("stroke-width", (borderWidthBase / currentZoom))
     })
   //   .on('end', function(){
   //      var tooltip = mapLayer.select(".tooltip");
   //      if (!tooltip.empty()) {
   //         tooltip.style("visibility", "hidden");
   //      }
   //   })

  function drawMapSessionCountry() {

     var rank,curRank;
     var fcolor = "#ffffff";
     var pos;
     var pNo = 1;
     var strLegend;
     var cLevel;

     d3.selectAll(".sessioncountry").remove();
     d3.selectAll(".sessioncountry-tooltip").remove();

     var tooltipOptions = {
        direction: "right",
        offset: [0, -40],
        sticky: true,
        opacity: 0.8,
        className: "sessioncountry-tooltip"
     };

     totalValue = 0;
     for (var i = 0; i < usersession.length; i++) {
        totalValue += parseFloat(usersession[i].Sessions);
        usersession[i].Rank = i + 1;
     }

     maxValue = d3.max(usersession, function(d) {
        return parseFloat(d.Sessions);
     });
     minValue = d3.min(usersession, function(d) {
        return parseFloat(d.Sessions);
     });

     d3.select("#legend")
        .html(setLegendContent())
        .style("left", function(){
           return "10px";
        })
        .style("top", function(){
           return (mapHeight - this.clientHeight + 30 - 10) + "px";
        })

     for (var i = 0; i < cborder.features.length; i++) {
        curRank = getRankSessionCountry(cborder.features[i].properties);
        cborder.features[i].properties.rank = curRank;
//console.log(cborder.features[i].properties.iso_a2 + " : " + cborder.features[i].properties.rank);
//console.log(cborder.features[i].properties.iso_a2 + "," + cborder.features[i].properties.countryname);

        if (curRank > 0) {
//           fcolor = colorLand(d3.min([parseFloat(usersession[cborder.features[i].properties.rank - 1].Sessions) / totalValue * 4,1]));
//           cLevel = d3.min([Math.sin((parseFloat(usersession[curRank - 1].Sessions)-minValue)/(maxValue-minValue)*Math.PI/2)*1.5,1]);
           cLevel = d3.min([Math.sqrt((parseFloat(usersession[curRank - 1].Sessions)-minValue)/(maxValue-minValue)),1]);
//           cLevel = d3.min([(parseFloat(usersession[curRank - 1].Sessions)-minValue)/(maxValue-minValue)*2,1]);
           fcolor = colorLand(cLevel);
//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+cLevel);
        } else {
           cLevel = 0;
           fcolor = "#ffffff";
        }
//cLevel=1;
        d3.select("#countryborder"+i)
           .style("fill",fcolor)
//           .style("fill-opacity", d3.min([(0.2+cLevel*0.9),1]))
           .style("fill-opacity", d3.min([(0.7+Math.sin(cLevel*Math.PI/2)*0.3),1]))
//           .style("fill-opacity", d3.min([(0.2+Math.sqrt(cLevel)*0.8),1]))

/*
           .style("fill-opacity", function(d) {
              if (curRank > 0) {
                 return (0.5 + cLevel / 2);
              } else {
                 return 0.5;
              }
           })
*/
           .attr("rank",cborder.features[i].properties.rank)
           .on('mouseover', function (e) {
              if (d3.select(this).attr("rank") > 0) {
                 d3.select(this).style("stroke-width", (borderWidthBase / currentZoom)*2);
                 d3.select("#sessioncountryTool")
                    .style("visibility", "visible")
              }
           })
           .on('mousemove', function (e) {
              if (d3.select(this).attr("rank") > 0) {
//alert(d3.select(this).attr("rank"));
                 setsessioncountryTooltipNew([d3.mouse(this)[0],d3.mouse(this)[1]],e);
              }
           })
           .on('mouseout', function (e) {
              if (d3.select(this).attr("rank") > 0) {
                 d3.select(this).style("stroke-width", (borderWidthBase / currentZoom)*1);
                 d3.select("#sessioncountryTool")
                    .style("visibility", "hidden")
              }
           })

     }

     notRelatedCounty = new Array();
     for (var i = 0; i < usersession.length; i++) {
//console.log(usersession[i].Country + ":"+ usersession[i].CountryName);
        if (!usersession[i].CountryName && usersession[i].Country.indexOf("not set") < 0){
           notRelatedCounty.push(usersession[i].Country);
//   alert(usersession[i].Country);
        }
     }
//        getImportValueFromWorldCSV(hscode);
  }

  function checkCountryName() {
     var txt = ""
     for (var i = 0; i < notRelatedCounty.length; i++) {
        txt += notRelatedCounty[i] + "\n";
     }
     if (notRelatedCounty.length > 0) {
        alert(txt);
     }
  }

  function getRankSessionCountry(data) {

     var i,countryname;

     for (i = 0; i < countryInfo.length; i++) {
        if (countryInfo[i].ISO_A2 == data.iso_a2) {
           data.countryname = countryInfo[i].CountryName;
           break;
        }
     }
     if (data.countryname) {
        for (var i = 0; i < usersession.length; i++) {
           if (usersession[i].Country == data.countryname) {
              usersession[i].CountryName = data.countryname;
              return usersession[i].Rank;
           }
        }
     }
     return 0;

  }

  function setsessioncountryTooltipNew(tipXY, e) {

     var strContent = "";
     var Sessions;
     var NewUsers;
     var fltShare,strShare;
     var fltShareb,strShareb;
     var strDescription;
     var properties = e.properties;
     var h;

//     strDescription = usersession[properties.rank].Description;
     Sessions = parseFloat(usersession[properties.rank - 1].Sessions);
     NewUsers = parseFloat(usersession[properties.rank - 1]["New Users"]);

     fltShare = (Sessions / totalValue) * 100;
     if (fltShare < 0.1) {
        strShare = String(fltShare.toFixed(2))+"%";
     } else {
        strShare = String(fltShare.toFixed(1))+"%";
     }
     fltShareb = (NewUsers / Sessions) * 100;
     if (fltShareb < 0.1) {
        strShareb = String(fltShareb.toFixed(2))+"%";
     } else {
        strShareb = String(fltShareb.toFixed(1))+"%";
     }

     strContent = sessionCountryInfoContents;
     strContent = strContent.replace(RegExp("#country#","g"),properties.countryname);
     strContent = strContent.replace(RegExp("#sessions#","g"),String(Sessions).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
     strContent = strContent.replace(RegExp("#share#","g"),strShare);
     strContent = strContent.replace(RegExp("#rank#","g"),properties.rank);
     strContent = strContent.replace(RegExp("#newsessionsrate#","g"),strShareb);
     strContent = strContent.replace(RegExp("#pagespersession#","g"),usersession[properties.rank - 1]["Pages / Session"]);
     strContent = strContent.replace(RegExp("#duration#","g"),usersession[properties.rank - 1]["Avg. Session Duration"]);

     d3.select("#sessioncountryTool")
        .html(strContent)
        .style("left",(tipXY[0]*currentZoom + offsetX + 10) + "px")
        .style("top",function() {
           h = tipXY[1]*currentZoom + offsetY + mapTop - this.clientHeight - 10;
           if (h < 0) {
              h = tipXY[1]*currentZoom + offsetY + mapTop + 10;
           }
           return h + "px";
        })
//        .style("top", function(){
//           return (mapHeight - this.clientHeight + 90 - 10) + "px";
//        })

     return strContent;

     

  }

  function SetTooltip(tipXY, tipText, rank) {

     var tooltip;// = svg.select(".tooltip")
     var fontSize = 12 / currentZoom;
     var fontWeight = "normal";
     var rectWidth = 0;
     var rectHeight = 0;
     var tipmargin = 2 / currentZoom;
     var paddingw = 10  / currentZoom;
     var paddingh = 5  / currentZoom;
     var tipOpacity = 0.8;
     var bbox = new Array();
     var tipleft,tiptop;

     svg = d3.select("svg");
     tooltip = mapLayer.select(".tooltip")

     mapLayer.selectAll(".tooltiptext").remove();

     if(tooltip.empty()) {
        tooltip = mapLayer
           .append("g")
           .attr("class","tooltip")

        tooltip
           .append("rect")
           .style("stroke","none")
           .style("fill","#f0f0f0")

     }
     
     for (var i = 0; i < tipText.length; i++) {
        if (String(tipText[i]).slice(0,6) == "<bold>") {
           tipText[i] = tipText[i].slice(6);
           fontWeight = "bold";
        } else {
           fontWeight = "normal";
        }
        tooltip
           .append("text")
           .attr("text-anchor","start")
           .attr("id","tooltiptext"+i)
           .attr("class","tooltiptext")
           .style("font-size",fontSize+"px")
           .style("font-family","sans-serif")
           .style("font-weight",fontWeight)
           .style("fill","#000066")
           .text(tipText[i])
           .call(function(elements) {
              bbox[i] = elements.node().getBBox();
              if (bbox[i].width > rectWidth) {
                 rectWidth = bbox[i].width;
              }
              bbox[i].py = rectHeight - bbox[i].y;
              rectHeight += bbox[i].height;
           })

     }

     rectWidth += paddingw*2;
     rectHeight += paddingh*2;

     tooltip.select("rect")
        .attr("width",rectWidth)
        .attr("height",rectHeight)
        .attr("rx",5 / currentZoom)
        .attr("ry",5 / currentZoom)
 
     for (var i = 0; i < tipText.length; i++) {
        tooltip.select("#tooltiptext"+i)
           .attr("x",  (rectWidth - bbox[i].width) / 2)
           .attr("y",  bbox[i].py + paddingh)
     }
     tipleft = tipXY[0] + tipmargin;
     if (rank > 0) {
        tipleft -= rectWidth;
     }
     tiptop = tipXY[1] - rectHeight - tipmargin;

//console.log(tipleft + "***" + tiptop);
     tooltip
        .style("visibility", "visible")
        .attr("transform", "translate("+tipleft+","+tiptop+")")

  }

  function rankUpDown(pm) {
     if (page+pm <= 0 || (pm > 0 && usersession.length <= page * rCnt)) {
        return 0;
     }
     page += pm;

     d3.select("#legend")
        .html(setLegendContent())

  }


  function setLegendContent() {

     var strContent = "";
     var strRank = "";
     var strRankTemp;
     var Value;
     var fltShare,strShare;
     var fileName = document.getElementById('f_FileName').value;
     var strSpan; //= document.getElementById('f_FileName').value;

     strContent = legendContents;
     strContent = strContent.replace(RegExp("#total#","g"),String(totalValue).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
     strSpan = "("+fileName.substr(0,fileName.length - 4)+")";
     strContent = strContent.replace(RegExp("#span#","g"),strSpan);//


     for (var i = (page-1) * rCnt; i < page * rCnt; i++) {
        if (usersession.length >= i + 1) {
           strRankTemp = rankContents;
           if (i == page * rCnt) {
              strRankTemp = strRankTemp.replace(RegExp("#rankno#","g"),"Rank #"+(i+1));
           } else {
              strRankTemp = strRankTemp.replace(RegExp("#rankno#","g"),"#"+(i+1));
           }
           strRankTemp = strRankTemp.replace(RegExp("#country#","g"),usersession[i].Country);
           strRankTemp = strRankTemp.replace(RegExp("#value#","g"),usersession[i].Sessions);
           Value = parseFloat(usersession[i].Sessions);
           fltShare = (Value / totalValue) * 100;
           if (fltShare < 0.1) {
              strShare = String(fltShare.toFixed(2))+"%";
           } else {
              strShare = String(fltShare.toFixed(1))+"%";
           }
           strRankTemp = strRankTemp.replace(RegExp("#share#","g"),strShare);
           strRank += strRankTemp;
        }
     }

     strContent = strContent.replace(RegExp("#rank#","g"),strRank);
     
     return strContent;
  }

  function openPieChartWindow() {

     var wTop = 10;
     var wLeft = 10;
     var wWidth = 800;
     var wHeight = 550;
     var hscode

     if (cWindowP && !cWindowP.closed) {
        cWindowP.close();
     }

     strURL = "BTP_PieChart.html?filename=" + document.getElementById('f_FileName').value;

     var wParam = "scrollbars=yes,resizable=no,toolbar=no,titlebar=no,menubar=no,location=no," +
                   "left="+wLeft+",top="+wTop+",width="+wWidth+",height="+wHeight;
     if (!cWindowP || cWindowP.closed) {
        cWindowP=window.open(strURL,"",wParam);
     }
  }

  function openBarChartWindowNewUser() {

     var wTop = 50;
     var wLeft = 400;
     var wWidth = 800;
     var wHeight = 500;
     var hscode

     if (cWindowB1 && !cWindowB1.closed) {
        cWindowB1.close();
     }

     strURL = "BTP_BarChart_NewUser.html?filename=" + document.getElementById('f_FileName').value;

     var wParam = "scrollbars=yes,resizable=no,toolbar=no,titlebar=no,menubar=no,location=no," +
                   "left="+wLeft+",top="+wTop+",width="+wWidth+",height="+wHeight;
     if (!cWindowB1 || cWindowB1.closed) {
        cWindowB1=window.open(strURL,"",wParam);
     }
  }

  function openBarChartWindowDuration() {

     var wTop = 50;
     var wLeft = 700;
     var wWidth = 800;
     var wHeight = 500;
     var hscode

     if (cWindowB2 && !cWindowB2.closed) {
        cWindowB2.close();
     }

     strURL = "BTP_BarChart_Duration.html?filename=" + document.getElementById('f_FileName').value;

     var wParam = "scrollbars=yes,resizable=no,toolbar=no,titlebar=no,menubar=no,location=no," +
                   "left="+wLeft+",top="+wTop+",width="+wWidth+",height="+wHeight;
     if (!cWindowB2 || cWindowB2.closed) {
        cWindowB2=window.open(strURL,"",wParam);
     }
  }


  function paintBackGround(fcolor) {

     svg.selectAll("rect")
        .each(function(d) {
           if (d3.select(this).attr("id") == "sea") {
              d3.select(this).attr("fill", fcolor);
           }
        });

  }


  function getFileList(dirName) {
     var folder = new Folder (dirname);
     var fileList = folder.getFiles();
     for (var i = 0; i < fileList.length; i++) {
        console.log(fileList[i].fullName);
     }

  }
  function SaveMapImage() {
     var svgElm = document.getElementById("svg");
     var svgData = new XMLSerializer().serializeToString(svgElm);
     d3.select("body").append("canvas")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("id", "canvas")

     canvg('canvas', svgData)
     alert("ready to save")
     var canvas = document.getElementById('canvas')
     canvas.toBlob(function(blob) {
        saveAs(blob, "UserActivity.jpg");
     }, "image/jpeg")
     d3.select("canvas").remove();
  }

