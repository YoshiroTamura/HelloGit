  var mapLayer;
  var svg;
  var mapScaleBase = 300;  //map scale base
  var mapScale = 180;  //map scale
  var mapWidth = 1100;   //width
  var mapHeight = 520;   //height
  var mapTop = 0;
  var mapPath, mapBounds, mapCenter;
  var plotLayer;
  var importLayer;
  var place = new Array();
  var placeMarkesr = new Array();
  var polygons = new Array();
  var colorLand = d3.interpolateHsl("#f5f5dc","#800000");
  var baseRad = 1.0;
  var country = new Array();
  var cborder,dborder,cborder2;
  var commodityHS;
  var usersession;
  var borderWidthBase = 1.0, borderWidthCircle = 0.5;
  var totalImport = 0;
  var totalValue = 0;
  var maxValue = 0;
  var minValue = 1.0e+12;
  var maxImport = 0;
  var currentZoom = 1;
  var offsetX = 0, offsetY = 0;
  var iniZoom = 2;
  var page = 1,rCnt = 10;
  var arc;
  var exportdestination;
  var importfromworld;
  var baseRad = 30, minRad = 2, maxRad = 100;
  var jsonCountryFileName = "json/WorldCountry_Btp.json?=" + new Date().getTime();
  var notRelatedCounty = new Array();
//  var SessionFileName = "csv/20170101-20170131.csv?=" + new Date().getTime();
  var FileDir = "csv/"
  var ListFileName = "FileList.txt?=" + new Date().getTime();
  var cWindowP,cWindowB1,cWindowB2,cWindowC;


  function initialize() {

     queue()
        .defer(d3.json, jsonCountryFileName)
        .defer(d3.text, FileDir + ListFileName)
        .await(ready);
  }

  function ready(error, data1, data2) {

     if (error) {
        alert("File list is not exist");
     }

     cborder = data1;
     var rows = d3.csvParseRows(data2);
     setFileName(rows);

/*
     usersession = data2;

     if (!usersession[usersession.length-1].Country) {
        usersession.pop();
     }
//     setmenu(usersession);

//console.log(usersession);
     drawMap();
*/

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
             console.log(usersession);
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
           SetTooltip([d3.mouse(this)[0],d3.mouse(this)[1]],[curText]);
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
        .style("background-color", "#ffffe0")
        .style("border-radius", "3px")
        .style("opacity", "1.0")

//     paintBackGround("#f0f9ff");
     paintBackGround("#ffffff");

     var zoomIn = d3.select("body").append("div")
        .attr("id", "zoomin")
        .attr("class", "zoom")
        .style("top", "100px")
        .style("left", "20px")
        .html("+")
        .on("click", function(d) {
           zoom.scaleTo(svg,currentZoom*1.6);
        })

     var zoomOut = d3.select("body").append("div")
        .attr("id", "zoomout")
        .attr("class", "zoom")
        .style("top", "135px")
        .style("left", "20px")
        .html("-")
        .on("click", function(d) {
           zoom.scaleTo(svg, currentZoom*0.625);
        })


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
        mapLayer.selectAll(".circle")
           .attr("r", function(d, i) {
              var crad = d3.max([Math.sqrt(d.ValueFromWorld / maxImport) * baseRad / Math.sqrt(currentZoom),minRad/currentZoom]);
              return crad;
           })
           .style("stroke-width", (borderWidthCircle / currentZoom))
        if (arc) {
           arc.outerRadius(function(d, i) {
              return d3.select("#circle"+d.Country).attr("r");
           })
           mapLayer.selectAll(".arc")
              .attr("d", arc)
        }
     })
     .on('end', function(){
        var tooltip = mapLayer.select(".tooltip");
        if (!tooltip.empty()) {
           tooltip.style("visibility", "hidden");
        }
     })

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
        curRank = getRankSessionCountry(cborder.features[i].properties.countryname);
        cborder.features[i].properties.rank = curRank;
//console.log(cborder.features[i].properties.iso_a2 + " : " + cborder.features[i].properties.rank);

        if (curRank > 0) {
//           fcolor = colorLand(d3.min([parseFloat(usersession[cborder.features[i].properties.rank - 1].Sessions) / totalValue * 4,1]));
           cLevel = d3.min([Math.sin((parseFloat(usersession[curRank - 1].Sessions)-minValue)/(maxValue-minValue)*Math.PI/2)*1.5,1]);
//           cLevel = d3.min([(parseFloat(usersession[curRank - 1].Sessions)-minValue)/(maxValue-minValue)*2,1]);
           fcolor = colorLand(cLevel);

        } else {
           fcolor = "#ffffff";
        }

        d3.select("#countryborder"+i)
           .style("fill",fcolor)
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

  function drawPieChartImportFromWorld() {

     var pos,cRad,a;
     var curText,strImport,strShare;
     var fltShare;

     d3.selectAll(".importpie").remove();

     svg = d3.select("svg");
     if (!importLayer) {
        importLayer = mapLayer.append('g')
           .attr("class","importLayer")
     }

//console.log(importfromworld);

     var importPie = importLayer.selectAll(".importpie")
        .data(importfromworld.filter(function(d) {
           return d.Centroid}))
        .enter()
        .append("g")
        .attr("class", "importpie")
        .on('mouseover', function(d) {
           d3.select(this).style("cursor", "pointer")
           importPie.select("#circle"+d.Country).style("stroke-width", (borderWidthCircle / currentZoom))
           importPie.select("#circle"+d.Country).style("opacity", "1.0");
           importPie.select("#arc"+d.Country).style("opacity", "1.0");

           strImport = String(d.ValueFromWorld).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' )
           curText = ["<bold>"+d.CountryName,"Total Import : "+strImport];
           if (d.ShareofBotswana > 0) {
              fltShare = d.ShareofBotswana * 100;
              if (fltShare < 0.1) {
                 strShare = String(fltShare.toFixed(2))+"%";
              } else {
                 strShare = String(fltShare.toFixed(1))+"%";
              }
              curText.push("Share of Botswana : " + strShare);
           }
           var posx = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[0];// + offsetX;
           var posy = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[1];// + offsetY;
           SetTooltip([posx,posy],curText,d3.select(this).select("circle").attr("r"));

        })
        .on('mouseout', function(d) {
           d3.select(this).style("cursor", "default")
           importPie.select("#circle"+d.Country).style("stroke-width", (borderWidthCircle / currentZoom))
           importPie.select("#circle"+d.Country).style("opacity", "0.6");
//           importPie.select("#arc"+d.Country).style("stroke-width", "0.5");
           importPie.select("#arc"+d.Country).style("opacity", "0.6");

           var tooltip = svg.select(".tooltip");
           if(!tooltip.empty()) {
              tooltip.style("visibility", "hidden");
           }
        })
        .on('click', function(d) {
           openPieChartWindow(d.Country);
        })
        .attr("transform", function(d) {
           if (d.Centroid) {
              var posx = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[0];// + offsetX;
              var posy = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[1];// + offsetY;
              return "translate("+ posx + "," + posy + ")";
           }
        })


     var importCircle = importPie.append("circle")
        .attr("id", function(d) {
           return "circle"+d.Country;
        })
        .attr("class","circle")
        .attr("r", function(d, i) {
           crad = d3.max([Math.sqrt(d.ValueFromWorld / maxImport) * baseRad ,minRad]);
           return crad;
        })
/*
        .attr("transform", function(d) {
           if (d.Centroid) {
              var posx = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[0];// + offsetX;
              var posy = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[1];// + offsetY;
              return "translate("+ posx + "," + posy + ")";
           }
        })
*/
        .style("fill", "#00c000")
        .style("opacity", "0.6")
        .style("stroke", "#606060")
        .style("stroke-width", (borderWidthCircle / currentZoom))
        .style("pointer-events", "auto")

     arc = d3.arc()
        .outerRadius(function(d) {
           return importPie.select("#circle"+d.Country).attr("r");

        })
        .innerRadius(0)
        .startAngle(0)
        .endAngle(function(d) {
           lv = d.ShareofBotswana;
           return lv * (Math.PI * 2);
        })

     importPie.append("path")
        .filter(function(d) {
           return d.ShareofBotswana >= 0.001;
        })
        .attr("id", function(d) {
           return "arc"+d.Country;
        })
        .attr("d", arc)
        .attr("class","arc")
        .attr("fill","#0098db")
        .style("opacity", "0.6")

/*
     importPie.selectAll(".arc")
        .attr("d", function(d) {
           return importarc(d);
        })
*/

 //    updateLayer();

  }



  function updateLayer() {

     var a,crad,lv;
     var pos;
 
     if (!importLayer) {
        return 0;
     }
     
     importLayer.selectAll(".arc").remove();

     var importPie = importLayer.selectAll('.importpie')
        .attr("transform", function(d) {
           if (d.Centroid) {
              var posx = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[0];// + offsetX;
              var posy = mapPath.projection()([d.Centroid[0],d.Centroid[1]])[1];// + offsetY;
              return "translate("+ posx + "," + posy + ")";
           }
        })
        .on('mousedown', function(d) {
/*
           strImport = String(d.Import_Value).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' )
           curText = ["<bold>"+d.CountryName,"Total Import : "+strImport];
           if (d.ShareofBotswana > 0) {
              fltShare = d.ShareofBotswana * 100;
              if (fltShare < 0.1) {
                 strShare = String(fltShare.toFixed(2))+"%";
              } else {
                 strShare = String(fltShare.toFixed(1))+"%";
              }
              curText.push("Share of Botswana : " + strShare);
           }
           pos = map.latLngToLayerPoint(new L.LatLng(d.Centroid[1], d.Centroid[0]));
           SetTooltip([pos.x,pos.y],curText,d3.select(this).select("circle").attr("r"));
*/
        })
        .on('mouseup', function(d) {
           var tooltip = svg.select(".tooltip");
           if(!tooltip.empty()) {
              tooltip.style("visibility", "hidden");
           }
        })
        .on('click', function(d) {
           openPieChartWindow(d.Country);
        })

     importPie.selectAll('.circle')
        .attr("r", function(d, i) {
/*
           if (map.getZoom() <= (iniZoom+2)) {
              a = Math.pow(2,(map.getZoom() - iniZoom));
           } else {
              a = 4;
           }
*/
           a = 1;
           crad = d3.max([Math.sqrt(d.Import_Value / maxImport) * baseRad * a,minRad]);
           return crad;
        })

     var arc = d3.arc()
        .outerRadius(function(d) {
           return importPie.select("#circle"+d.Country).attr("r");
        })
        .innerRadius(0)
        .startAngle(0)
        .endAngle(function(d) {
           lv = d.ShareofBotswana;
           return lv * (Math.PI * 2);
        });

     importPie.append("path")
        .filter(function(d) {
           return d.ShareofBotswana >= 0.001;
        })
        .attr("d", arc)
        .attr("id", function(d) {
           return "arc"+d.Country;
        })
        .attr("class","arc")
        .attr("fill","#0098db")
        .style("opacity", "0.6")

  }


  function getExportYear(fld) { 

     var json;
     jQuery.ajax({
        url : "getexportyear.php",
        type : "get",
        dataType : 'json',
        data : "",
        success: function(request){
            json = request;
            setExportYear(fld,json);
        },
        error: function() {
           alert('failed to get year info');
        }
     });
  }

  function setExportYear(fld) {

     var i;
     var txtOption = "";

     for (var y = 2011; y <= 2015; y++) {
        txtOption += "<option value='"+y+"'";
        if (y == 2015) {
           txtOption += "  SELECTED";
        }
        txtOption += ">"+y+"</option>"
     }
     fld.innerHTML = txtOption;
  }


  function getsessioncountryCSV(hscode) {

     var year = document.getElementById('f_Year').value;
     var csvFile = ExportFileName.replace("year", year);

     d3.csv(csvFile, function(error, data){
        setExportsessioncountry(hscode,data);
     });

  }

  function setExportsessioncountry(hscode, yeardata) {

     var i;
     var n = 0;
     var txtOption = "";
     var strDescription = getDescription(hscode);

     exportsessioncountry = new Array();

     for (var i = 0; i < yeardata.length; i++) {
        if (yeardata[i].HS_Code == hscode) {
           yeardata[i].Description = strDescription
           exportsessioncountry.push(yeardata[i]);
        }
     }

     relateCountryExport();

//console.log(exportsessioncountry);

     drawMapsessioncountry(hscode);

  }

  function getDescription(hscode) {

     if (hscode == "00") {
        return "All Commodities Total";
     } else {
        for (var i = 0; i < commodityHS.length; i++) {
           if (commodityHS[i].HS_Code == hscode) {
              return commodityHS[i].Description;
           }
        }
     }

  }


  function getRankSessionCountry(countryname) {

//console.log(countryname);

     for (var i = 0; i < usersession.length; i++) {
        if (usersession[i].Country == countryname) {
usersession[i].CountryName = countryname;
           return usersession[i].Rank;
        }
     }
     return 0;

  }

  function changeImportFromWorld(chkValue) {

     var hscode,hscodeheading,hscodesubheading;

     if (!chkValue) {
        hscode="";
     } else {
        hscodeheading = document.getElementById('f_HS_Code_Heading').value;
        hscodesubheading = document.getElementById('f_HS_Code_Subheading').value;
        if (hscodesubheading.length == 6) {
           hscode = hscodesubheading;
        } else if (hscodeheading.length == 4) {
           hscode = hscodeheading;
        } else {
           hscode = document.getElementById('f_HS_Code_Chapter').value;
        }
     }
     getImportValueFromWorldCSV(hscode);

  }

  function getImportValueFromWorldCSV(hscode) {

     importfromworld = new Array();

     if (hscode.length > 0) {
        var year = document.getElementById('f_Year').value;
        var csvFile = (ImportFileName.replace("year", year)).replace("hscode", hscode.substr(0,2));

        d3.csv(csvFile, function(error, data){
//alert(data.length);
           setImportFromWorld(hscode,data);
        });
     } else {
        drawPieChartImportFromWorld();

     }
  }

  function setImportFromWorld(hscode, yeardata) {

     var i;
     var n = 0;
     var txtOption = "";

     importfromworld = new Array();

     for (var i = 0; i < yeardata.length; i++) {
        if (yeardata[i].HS_Code == hscode) {
           importfromworld.push(yeardata[i]);
//           relateCountry(importfromworld[importfromworld.length-1],importfromworld[importfromworld.length-1].Country)
        }
     }
     relateCountry();
//console.log(exportsessioncountry);
     drawPieChartImportFromWorld();

  }


  function relateCountry() {


     totalImport = d3.sum(importfromworld, function(d) {
        return parseFloat(d.ValueFromWorld);
     });
     maxImport = d3.max(importfromworld, function(d) {
        return parseFloat(d.ValueFromWorld);
     });

//alert("total import:"+totalImport);

for (var j = 0; j < cborder.features.length; j++) {
//   console.log(d3.geoCentroid(cborder.features[j]));
}

     for (var i = 0; i < importfromworld.length; i++) {
        importfromworld[i].ValueFromWorld = parseFloat(importfromworld[i].ValueFromWorld);
        importfromworld[i].ValueFromBotswana = parseFloat(importfromworld[i].ValueFromBotswana);
        if (importfromworld[i].ValueFromWorld > 0 && importfromworld[i].ValueFromBotswana > 0) {
           importfromworld[i].ShareofBotswana = importfromworld[i].ValueFromBotswana / d3.max([importfromworld[i].ValueFromWorld,importfromworld[i].ValueFromBotswana]);
        } else {
           importfromworld[i].ShareofBotswana = 0;
        }
        for (var j = 0; j < cborder.features.length; j++) {
           if (cborder.features[j].properties.countryname == importfromworld[i].Country) {
/*Centroid_Lat	Centroid_Lng
60.41776699	-96.54862673
              if (importfromworld[i].Country == "US") {
                 importfromworld[i].Centroid = [-98.82068509, 39.88678054];
              } else if (importfromworld[i].Country == "CA") {
                 importfromworld[i].Centroid = [-99.00452576, 58.59211574];
              } else if (importfromworld[i].Country == "FR") {
                 importfromworld[i].Centroid = [2.460962902, 46.57229358];
              } else if (importfromworld[i].Country == "MY") {
                 importfromworld[i].Centroid = [102.19026650, 4.032001263];
              } else {
                 importfromworld[i].Centroid = d3.geoCentroid(cborder.features[j]);
              }
*/
              importfromworld[i].Centroid = [cborder.features[j].properties.centroid_lng,cborder.features[j].properties.centroid_lat];
              importfromworld[i].CountryName = cborder.features[j].properties.countryname;
              importfromworld[i].Region = cborder.features[j].properties.region;
              importfromworld[i].SubRegion = cborder.features[j].properties.subregion;
           }
        }
     }

  }

  function relateCountryExport() {

     for (var i = 0; i < exportsessioncountry.length; i++) {
        for (var j = 0; j < cborder.features.length; j++) {
           if (cborder.features[j].properties.iso_a2 == exportsessioncountry[i].Partner) {
              exportsessioncountry[i].Centroid = d3.geoCentroid(cborder.features[j]);
              exportsessioncountry[i].CountryName = cborder.features[j].properties.countryname;
              exportsessioncountry[i].Region = cborder.features[j].properties.region;
              exportsessioncountry[i].SubRegion = cborder.features[j].properties.subregion;
           }
        }
//console.log(              exportsessioncountry[i]);

     }

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

  function SetTooltip(tipXY, tipText, radius) {

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

     if (radius == null) {
        radius = 0;
     }

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

     tipleft = tipXY[0] + tipmargin + parseInt(radius*Math.cos(45 / 180 * Math.PI));
     if (tipleft + rectWidth > mapWidth) {
//        tipleft = map.getSize().x - rectWidth;
     }
     tiptop = tipXY[1] - rectHeight - tipmargin - parseInt(radius*Math.cos(45 / 180 * Math.PI));

//console.log(tipleft + "***" + tiptop);
     tooltip
        .style("visibility", "visible")
        .attr("transform", "translate("+tipleft+","+tiptop+")")

  }

  function exportBotswanaExportData() {

     var i,j;
     var csv = new Array();
     var data;
     var filename;
     var column = ["Rank","Year","Partner","CountryName","HS_Code","Description","Export_Value","Region","SubRegion"];

     if (usersession.length == 0) {
        return 0;
     }
/*
for (var j = 0; j < cborder.features.length; j++) {
   data = cborder.features[j].properties.iso_a2 + "," +  d3.geoCentroid(cborder.features[j])[0] + "," + d3.geoCentroid(cborder.features[j])[1];
   csv.push(data + "\n");
   console.log(cborder.features[j].properties.iso_a2 + "," +  d3.geoCentroid(cborder.features[j])[0] + "," + d3.geoCentroid(cborder.features[j])[1] );
}
filename = "CentroidNew.csv";
var blob = new Blob(csv, {type: "text/plain;charset=utf-8"});
saveAs(blob, filename);
return 0;
*/


     filename = "BotswanaExport_" + exportsessioncountry[0].HS_Code + "_" + exportsessioncountry[0].Year + ".csv";

console.log(exportsessioncountry);

     for (i = 0; i < column.length; i++) {
        if (i == 0) {
           data = "";
        } else {
           data += ",";
        }
        data += "\"" + column[i] + "\"";
     }
     csv.push(data + "\n");

     for (j = 0; j < exportsessioncountry.length; j++) {
        for (i = 0; i < column.length; i++) {
           if (i == 0) {
              data = "";
           } else {
              data += ",";
           }
           data += "\"" + exportsessioncountry[j][column[i]] + "\"";
        }
        csv.push(data + "\n");
     }
     for (i = 0; i < csv.length; i++) {
        console.log(csv[i]);
     }

     var blob = new Blob(csv, {type: "text/plain;charset=utf-8"});

     saveAs(blob, filename);

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

