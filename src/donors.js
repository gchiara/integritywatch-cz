import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'donors',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  selectedMandate: 'all',
  modalShowTable: 'a',
  resetInProgress: false,
  charts: {
    topDonorsPerson: {
      title: 'Největší individuální dárci',
      info: 'Top individual donors'
    },
    topDonorsBusiness: {
      title: 'Největší firemní dárci',
      info: 'Top businesses by total value of donations to parties made directly by the business'
    },
    topDonorsPersonIndirect: {
      title: 'Největší dárci podle výše přímých a nepřimých darů',
      info: 'Top beneficial owners by number of businesses'
    },
    entityType: {
      title: 'Objem darů podle právní formy dárce',
      info: 'Parties by number of donations received (directly from the businesses)'
    },
    years: {
      title: 'Objem darů v letech',
      info: 'Parties by number of businesses who donated to them directly or whose beneficial owners donated to them.'
    },
    parties: {
      title: 'Objem darů dle strany',
      info: 'Type of donations made directly by businesses'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Dárci',
      info: 'Lorem ipsum'
    }
  },
  selectedEl: {"Name": ""},
  colors: {
    default: "#009fe2",
    range: ["#62aad9", "#3b95d0", "#1a6da3", "#085c9c", "#063e69", "#e3b419", "#e39219", "#de7010", "#c9530e"],
    colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"],
    numPies: {
      "0": "#ddd",
      "1": "#ff516a",
      "2": "#f43461",
      "3": "#e51f5c",
      "4": "#d31a60",
      ">5": "#bb1d60"
    },
    parties: {
      "SOCDEM": "#FF5F60",
      "Zelení": "#60B34D",
      "KDU-ČSL": "#FFD719",
      "KSČM": "#C72626",
      "SPD": "#0E76BB",
      "PŘÍSAHA": "#0033FF",
      //"ODS": "#0E3F95",
      "ODS": "#2E5Fb5",
      "STAN": "#AFCA09",
      //"Piráti": "#444444",
      "Piráti": "#666666",
      "TOP 09": "#FF0053",
      //"ANO": "#232161",
      "ANO": "#434181",
    }
  }
}

//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    formatValue: function(x){
      if(parseInt(x)){
        return x.toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      return x;
    },
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Integrity Watch Czech Republic ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://integritywatch.cz';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

var locale = d3.formatLocale({
  decimal: ",",
  thousands: " ",
  grouping: [3]
});

//Charts

var charts = {
  topDonorsPerson: {
    chart: dc.rowChart("#topdonorsperson_chart"),
    type: 'row',
    divId: 'topdonorsperson_chart'
  },
  topDonorsBusiness: {
    chart: dc.rowChart("#topdonorsbusiness_chart"),
    type: 'row',
    divId: 'topdonorsbusiness_chart'
  },
  topDonorsPersonIndirect: {
    chart: dc.rowChart("#topdonorspersonindirect_chart"),
    type: 'row',
    divId: 'topdonorspersonindirect_chart'
  },
  entityType: {
    chart: dc.rowChart("#entitytype_chart"),
    type: 'row',
    divId: 'entitytype_chart'
  },
  years: {
    chart: dc.barChart("#years_chart"),
    type: 'bar',
    divId: 'years_chart'
  },
  parties: {
    chart: dc.rowChart("#parties_chart"),
    type: 'row',
    divId: 'parties_chart'
  },
  table: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("wordcloud_chart_col").offsetWidth - vuedata.chartMargin*2;
  return [width, 410];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth > 430) {
    newWidth = 430;
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      if(charts[c].divId == 'topdonorsbusiness_chart') {
        charts[c].chart.label(function (d) {
          var thisKey = donorsKeyVal[d.key].donorName;
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        })
      } else {
        charts[c].chart.label(function (d) {
          var thisKey = d.key;
          if(thisKey.indexOf('###') > -1){
            thisKey = thisKey.split('###')[0];
          }
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        })
      }
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(true).legendWidth(sizes.width));
        //.legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
    }
    if(charts[c].divId == 'topdonorspersonindirect_chart' || charts[c].divId == 'topdonorsperson_chart') {
      charts[c].chart
      .label(function (d) {
        if(d.key.length > charsLength){
          return toTitleCase(d.key.split('###')[0].substring(0,charsLength)) + '...';
        }
        return toTitleCase(d.key.split('###')[0]);
      })
      .title(function (d) {
          return toTitleCase(d.key.split('###')[0]) + ': ' + formatValue(d.value) + ' Kč';
      })
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Apply comma as decimal separator and space as thousands separator
function formatValue(x){
  if(parseInt(x)){
    return x.toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  return x;
}
//Format by thousands and apply separators
function formatValueThousands(x){
  if(parseInt(x)){
    if(x > 1000){
      return (x/1000).toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + 'k';
    }
    return x.toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  return x;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "currency-amt-pre": function (amt) {
      return parseFloat(amt.replace(' Kč','').replaceAll(' ','').replace(',','.'));
  },
  "currency-amt-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "currency-amt-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "icodob-pre": function (icodob) {
      if(icodob.indexOf('.') > -1) {
        var icodobSplit = icodob.split('.');
        if(icodobSplit.length == 3 && icodob.length == 10) {
          return icodobSplit[2] + icodobSplit[1] + icodobSplit[0];
        }
      } else {
        return icodob;
      }
  },
  "icodob-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "icodob-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

/*
function toTitleCase(str) {
  str = str.toLowerCase();
  return str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}
*/
function toTitleCase(str) {
  str = str.toLowerCase();
  str = str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  var words = str.split(' ');
  var wordsFixed = [];
  _.each(words, function (w) {
    var w1 = w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
    wordsFixed.push(w1);
  });
  return wordsFixed.join(' ');
}

function reformatBirthdate(birthdate) {
  var birthdate2 = '';
  var dobSplit = birthdate.split('-');
  if(dobSplit.length == 3) {
    birthdate2 = dobSplit[2] + '.' + dobSplit[1] + '.' + dobSplit[0];
    return birthdate2;
  }
  return birthdate;
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

var donorsKeyVal = {};
var donorsLean = [];

json('./data/donations.json?' + randomPar, (err, donations) => {
json('./data/donors_flagged.json?' + randomPar, (err, donors) => {
  //Parse data
  _.each(donors, function (d) {
    if(d.nameFromRegistry && d.nameFromRegistry !== '') {
      d.donorName = d.nameFromRegistry;
    }
    d.donorNameTitleCase = toTitleCase(d.donorName);
    if( d.donorName == 'dary Vrácené') {
      d.donorName = 'dary vrácené';
      d.donorNameTitleCase = 'dary vrácené';
    }
    donorsKeyVal[d.donorKey] = d;
    var donorLeanEntry = {
      'donorKey': d.donorKey,
      'donorInBusinessRegistry': d.donorInBusinessRegistry,
      'donationsAmtDirect': d.donationsAmtDirect,
      'donationsAmtIndirect': d.donationsAmtIndirect,
      'hasForeignOwner': false,
      'yearlyDonationsAboveThreshold': false
    }
    if(d.foreignOwnerAtDonationsDate) { donorLeanEntry.hasForeignOwner = d.foreignOwnerAtDonationsDate; }
    if(d.yearlyDonationsAboveThreshold) { donorLeanEntry.yearlyDonationsAboveThreshold = d.yearlyDonationsAboveThreshold; }
    donorsLean.push(donorLeanEntry);
    //Get address string
    d.addressString = '';
    if(d.address) {
      if(d.address.adresaText) {
        d.addressString = d.address.adresaText;
      } else {
        var ulice = '';
        if(d.address.ulice) { ulice = d.address.ulice + '' }; 
        var cisloPo = '';
        if(d.address.cisloPo) { cisloPo = d.address.cisloPo }; 
        var obec = '';
        if(d.address.obec) { obec = d.address.obec + ',' }; 
        var okres = '';
        if(d.address.okres) { okres = d.address.okres + ',' }; 
        var psc = '';
        if(d.address.psc) { psc = d.address.psc }; 
        if(d.address.cisloOr) {
          d.addressString = ulice + ' ' + cisloPo + '/' + d.address.cisloOr + ', ' + obec + ' ' + okres + ' ' + psc;
        } else {
          d.addressString = ulice + ' ' + cisloPo + ', ' + obec + ' ' + okres + ' ' + psc;
        }
      }
    }
    //Get full length id if lass than 8 chars
    if(d.donorType == 'legal entity') {
      var zeroToAdd = 8 - d.donorKey.length;
      if (zeroToAdd > 0) {
        d.donorKey8 = d.donorKey;
        for (var i = 0; i < zeroToAdd; i++) {
          d.donorKey8 = '0' + d.donorKey8;
        }
      }
    }
    //Get date of birth in dd.mm.yyyy format
    if(d.donorType !== 'legal entity') {
      d.birthdate2 = '';
      var dobSplit = d.donorIcoDoB.split('-');
      if(dobSplit.length == 3) {
        d.birthdate2 = dobSplit[2] + '.' + dobSplit[1] + '.' + dobSplit[0];
      }
    }
  });
  _.each(donations, function (d) {
    if(!d.indirectBoDonors) { d.indirectBoDonors = []; }
    d.indirectBoDonorsCharts = [];
    d.allDonorsForCrossfiltering = [d.donorKey];
    _.each(d.indirectBoDonors, function (bo) {
      d.allDonorsForCrossfiltering.push(bo);
      var lastSpaceIndex = bo.lastIndexOf(' ');
      var boName = bo.slice(0, lastSpaceIndex);
      var boDoB = bo.slice(lastSpaceIndex + 1);
      d.indirectBoDonorsCharts.push(bo.slice(0, lastSpaceIndex) + '###' + bo.slice(lastSpaceIndex + 1));
    });
    d.amount = 'N/A';
    d.from = 'N/A';
    d.donorKeyCharts = d.donorKey;
    d.donorRegistryName = '';
    if(d.donorType == 'person') {
      if(d.fName == 'dary' && d.lName == 'Vrácené') {
        d.fName = 'dary';
        d.lName = 'vrácené';
      }
      d.from = d.fName + ' ' + d.lName;
      d.donorKeyCharts = d.fName + ' ' + d.lName + '###' + d.birthDate;
    } else if(d.donorType == 'legal entity') {
      d.from = d.company + ' (' + d.companyId + ')';
      d.donorKeyCharts = d.company + '###' + d.companyId;
      d.donorRegistryName = donorsKeyVal[d.donorKey].donorName;
      //Get full length id if shorter than 8
      var zeroToAdd = 8 - d.donorKey.length;
      if (zeroToAdd > 0) {
        d.donorKey8 = d.donorKey;
        for (var i = 0; i < zeroToAdd; i++) {
          d.donorKey8 = '0' + d.donorKey8;
        }
      }
    }
    if(d.type == 'monetary') {
      d.amount = d.money;
    } else if(d.type == 'service') {
      d.amount = d.value;
    }
    if(d.amount < 0) {
      d.isReturnedDonation = true;
    }
    d.amountNum = d.amount;
    if(isNaN(d.amountNum)) {
      d.amountNum = 0;
    }
    //Entity type
    d.entityType = '';
    if(donorsKeyVal[d.donorKey] && donorsKeyVal[d.donorKey].orgType) {
      d.entityType = donorsKeyVal[d.donorKey].orgType;
    }
    /*
    //Donations type
    d.donationTypes = [];
    for (var i=0; i<d.serviceDNumDirect; i++) {
      d.donationTypes.push('In-kind');
    }
    for (var i=0; i<d.monetaryDNumDirect; i++) {
      d.donationTypes.push('Monetary');
    }
    */
  });

  //Set dc main vars
  var ndx = crossfilter(donations);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = ' ' + d.from + ' ' + d.party + ' ' + d.donorRegistryName;
      if(d.donorKey8) {
        entryString = entryString + ' ' + d.donorKey8;
        console.log(entryString);
      }
      return entryString.toLowerCase();
  });
  var donorKeyDimension = ndx.dimension(function(d){return d.donorKey});
  var dataByDonorKey = donorKeyDimension.group().reduceCount();

  var ndx2 = crossfilter(donorsLean);
  var searchDimension2 = ndx2.dimension(function (d) {
    return d.donorKey;
  });
  

  var filterDonors = function() {
    if(vuedata.resetInProgress == true) {
      return;
    }
    var donorsKeys = {};
    _.each(searchDimension.top(Infinity), function (d) {
      _.each(d.allDonorsForCrossfiltering, function (donor) {
        donorsKeys[donor] = true;
      });
    });
    searchDimension2.filter(function(d) { 
      return donorsKeys[d];
    });
  }

//searchDimension2.top(Infinity)

  //CHART 1 - Top individual donors
  var createTopDonorsPersonChart = function() {
    var chart = charts.topDonorsPerson.chart;
    var dimension = ndx.dimension(function (d) {
        return d.donorKeyCharts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        if(d.donorType == "person"){ return d.amountNum; }
        return -1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return d.value > 0.001;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDonorsPerson.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(520)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
        if(d.key.length > charsLength){
          return toTitleCase(d.key.split('###')[0].substring(0,charsLength)) + '...';
        }
        return toTitleCase(d.key.split('###')[0]);
      })
      .title(function (d) {
          return toTitleCase(d.key.split('###')[0]) + ': ' + formatValue(d.value) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
    chart.on('filtered', function(c) { 
      filterDonors();
      dc.redrawAll();
    });
  }

  

  //CHART 2 - Top corporate donors
  var createTopDonorsBusinessChart = function() {
    var chart = charts.topDonorsBusiness.chart;
    var dimension = ndx.dimension(function (d) {
        return d.donorKeyCharts.split('###')[1];
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        if(d.donorType == "legal entity"){ return d.amountNum; }
        return -1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return d.value > 0.001;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDonorsBusiness.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(520)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
        if(d.key.length > charsLength){
          return donorsKeyVal[d.key].donorName.substring(0,charsLength) + '...';
          return d.key.split('###')[0].substring(0,charsLength) + '...';
        }
        return donorsKeyVal[d.key].donorName;
        return d.key.split('###')[0];
      })
      .title(function (d) {
          return donorsKeyVal[d.key].donorName + ' (' + d.key + ')' + ': ' + formatValue(d.value) + ' Kč';
          //return d.key.split('###')[0] + ': ' + formatValue(d.value) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
    chart.on('filtered', function(c) { 
      filterDonors();
      dc.redrawAll();
    });
  }

  //CHART 3 - Top individual donors direct and indirect
  var createTopDonorsPersonIndirectChart = function() {
    var chart = charts.topDonorsPersonIndirect.chart;
    var dimension = ndx.dimension(function (d) {
        if(d.donorType == "person") { return [d.donorKeyCharts]; }
        if(d.donorType == "legal entity") { return d.indirectBoDonorsCharts; }
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return d.amountNum;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return d.value > 0.001;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDonorsPersonIndirect.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return toTitleCase(d.key.split('###')[0].substring(0,charsLength)) + '...';
          }
          return toTitleCase(d.key.split('###')[0]);
      })
      .title(function (d) {
          return toTitleCase(d.key.split('###')[0]) + ': ' + formatValue(d.value) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
    chart.on('filtered', function(c) { 
      filterDonors();
      dc.redrawAll();
    });
  }

  //CHART 4 - Top entity types
  var createEntityTypeChart = function() {
    var chart = charts.entityType.chart;
    var dimension = ndx.dimension(function (d) {
        return d.entityType;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.amountNum;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return d.value > 0.001 && d.key !== '';
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.entityType.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
        if(d.key.length > charsLength){
          return d.key.split('###')[0].substring(0,charsLength) + '...';
        }
        return d.key.split('###')[0];
      })
      .title(function (d) {
          return d.key.split('###')[0] + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
    chart.on('filtered', function(c) { 
      filterDonors();
      dc.redrawAll();
    });
  }

  //CHART 5 - Years
  var createYearsChart = function() {
    var chart = charts.years.chart;
    var dimension = ndx.dimension(function (d) {
        if(isNaN(d.year)) { return ''; }
        return d.year;
    });
    var group = dimension.group().reduceSum(function (d) {
        return d.amountNum;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(Infinity).filter(function(d) {
            return d.value > 0.001;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.years.divId);
    chart
      .width(width)
      .height(515)
      .group(filteredGroup)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 70})
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .gap(15)
      .elasticY(true)
      //.yAxisLabel( "Akcije" )
      //.yAxis().tickFormat(function(d) { return formatValue(d) + ' Kč' })
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      });
    chart.yAxis().tickFormat(function(d) { return formatValueThousands(d) + ' Kč' })
    chart.render();
    chart.on('filtered', function(c) { 
      filterDonors();
      dc.redrawAll();
    });
  }

  //CHART 6 - Top parties
  var createPartiesChart = function() {
    var chart = charts.parties.chart;
    var dimension = ndx.dimension(function (d) {
        return d.party;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.amountNum;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return d.value > 0.001;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.parties.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(515)
      .gap(10)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
        if(d.key.length > charsLength){
          return d.key.split('###')[0].substring(0,charsLength) + '...';
        }
        return d.key.split('###')[0];
      })
      .title(function (d) {
          return d.key.split('###')[0] + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
    chart.on('filtered', function(c) { 
      filterDonors();
      dc.redrawAll();
    });
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
      "language": {
        "info": "Zobrazeno _START_ až _END_ z _TOTAL_ položek",
        "lengthMenu": "Zobrazit _MENU_ položek",
        "search": "Vyhledávání:",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Další",
          "previous":   "Předchozí"
        }
      },
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            if(donorsKeyVal[d.donorKey].donorType && donorsKeyVal[d.donorKey].donorType !== 'individual') {
              return donorsKeyVal[d.donorKey].donorName;
            }
            return donorsKeyVal[d.donorKey].donorNameTitleCase;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "type": "icodob",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            if(donorsKeyVal[d.donorKey].birthdate2) {
              return donorsKeyVal[d.donorKey].birthdate2;
            }
            if(donorsKeyVal[d.donorKey].donorKey8) {
              return donorsKeyVal[d.donorKey].donorKey8;
            }
            return donorsKeyVal[d.donorKey].donorIcoDoB;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            if(donorsKeyVal[d.donorKey].donorType) {
              return donorsKeyVal[d.donorKey].donorType;
            }
            return 'individual';
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            return formatValue(donorsKeyVal[d.donorKey].donationsAmtDirect) + ' Kč';
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            return formatValue(donorsKeyVal[d.donorKey].donationsAmtIndirect) + ' Kč';
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "class": "dt-body-center",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            if(donorsKeyVal[d.donorKey].yearlyDonationsAboveThreshold) {
              return '<img src="./images/redflag.png" class="redflag-img">';
            }
            return '';
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "class": "dt-body-center",
          "data": function(d) {
            if(!donorsKeyVal[d.donorKey]) {
              return '';
            }
            if(donorsKeyVal[d.donorKey].foreignOwnerAtDonationsDate) {
              return '<img src="./images/redflag.png" class="redflag-img">';
            }
            return '';
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "asc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      //"aaData": dataByDonorKey.top(Infinity),
      "aaData": searchDimension2.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.table.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      if(donorsKeyVal[data.donorKey]) {
        data = donorsKeyVal[data.donorKey];
      }
      vuedata.selectedEl = data;
      if(vuedata.selectedEl.donations && vuedata.selectedEl.indirectDonations) {
        vuedata.selectedEl.allDonations = vuedata.selectedEl.donations.concat(vuedata.selectedEl.indirectDonations);
      } else {
        vuedata.selectedEl.allDonations = vuedata.selectedEl.donations;
      }
      vuedata.modalShowTable = 'a';
      $('#detailsModal').modal();
      InitializeDonationsTable();
      if(vuedata.selectedEl.entities) { InitializeEntitiesTable(); }
      if(vuedata.selectedEl.ownershipStructure && vuedata.selectedEl.ownershipStructure.bo) { InitializeBoTable(); }
      if(vuedata.selectedEl.ownershipStructure && vuedata.selectedEl.ownershipStructure.owners) { InitializeOwnershipTable(); }
    });
  }

  function InitializeDonationsTable() {
    var dTable = $("#modalDonationsTable");
    dTable.DataTable ({
      "data" : vuedata.selectedEl.allDonations,
      "destroy": true,
      "search": true,
      "pageLength": 20,
      "dom": '<<t>pi>',
      "order": [[ 0, "desc" ]],
      "language": {
        "info": "Zobrazeno _START_ až _END_ z _TOTAL_ položek",
        "lengthMenu": "Zobrazit _MENU_ položek",
        "search": "Vyhledávání:",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Další",
          "previous":   "Předchozí"
        }
      },
      "columns" : [
        { "data" : function(a) { 
          if(a.date) { return a.date; }
          if(a.year) { return a.year; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
            if(a.type) { 
              if(a.type == 'service') {
                if(a.donationAmt < 0 ) {
                   return 'in-kind (returned donation)';
                }
                return 'in-kind';
              }
              if(a.donationAmt < 0 ) {
                return a.type + ' (returned donation)';
              }
              return a.type;
            }
            return "N/A";
          }
        },
        { "data" : function(a) { 
            if(a.donorType == 'legal entity') { return a.company; }
            else { return a.fName + ' ' + a.lName; }
            return "N/A";
          }
        },
        { 
          //"type": "icodob",
          "data" : function(a) { 
          if(a.companyId) {return a.companyId; }
          else if(a.birthDate) { return a.birthDate; }
          return "N/A";
          }
        },
        { "data" : function(a) { 
            if(a.party) { return a.party; }
            return "N/A";
          }
        },
        {
          "data" : function(a) { 
            if(a.description) { return a.description; }
            return "N/A";
          }
        },
        { "type": "currency-amt",
          "data" : function(a) { 
            return formatValue(a.donationAmt) + ' Kč';
          } 
        }
      ]
    });
  }

  function InitializeBoTable() {
    var dTable = $("#modalBoTable");
    dTable.DataTable ({
      "data" : vuedata.selectedEl.ownershipStructure.bo,
      "destroy": true,
      "search": true,
      "pageLength": 20,
      "dom": '<<t>pi>',
      "order": [[ 0, "desc" ]],
      "language": {
        "info": "Zobrazeno _START_ až _END_ z _TOTAL_ položek",
        "lengthMenu": "Zobrazit _MENU_ položek",
        "search": "Vyhledávání:",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Další",
          "previous":   "Předchozí"
        }
      },
      "columns" : [
        { "data" : function(a) { 
          if(a.fName && a.lName) { return a.fName + ' ' + a.lName; }
          else if(a.lName) { return a.lName; }
          else if(a.fName) { return f.lName; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.birthdate) { return a.birthdate; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.country) { return a.country; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.skutecnymMajitelemOd) { return a.skutecnymMajitelemOd; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.skutecnymMajitelemDo) { return a.skutecnymMajitelemDo; }
          return 'N/A';
          }
        }
      ]
    });
  }

  function InitializeEntitiesTable() {
    var dTable = $("#modalEntitiesTable");
    dTable.DataTable ({
      "data" : vuedata.selectedEl.entities,
      "destroy": true,
      "search": true,
      "pageLength": 20,
      "dom": '<<t>pi>',
      "order": [[ 0, "desc" ]],
      "language": {
        "info": "Zobrazeno _START_ až _END_ z _TOTAL_ položek",
        "lengthMenu": "Zobrazit _MENU_ položek",
        "search": "Vyhledávání:",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Další",
          "previous":   "Předchozí"
        }
      },
      "columns" : [
        { "data" : function(a) { 
          if(a.nazev) { return a.nazev; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.ico) { return a.ico; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.skutecnymMajitelemOd) { return a.skutecnymMajitelemOd; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.skutecnymMajitelemDo) { return a.skutecnymMajitelemDo; }
          return 'N/A';
          }
        }
      ]
    });
  }

  function InitializeOwnershipTable() {
    var dTable = $("#modalOwnershipTable");
    dTable.DataTable ({
      "data" : vuedata.selectedEl.ownershipStructure.owners,
      "destroy": true,
      "search": true,
      "pageLength": 20,
      "dom": '<<t>pi>',
      "order": [[ 0, "desc" ]],
      "language": {
        "info": "Zobrazeno _START_ až _END_ z _TOTAL_ položek",
        "lengthMenu": "Zobrazit _MENU_ položek",
        "search": "Vyhledávání:",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Další",
          "previous":   "Předchozí"
        }
      },
      "columns" : [
        { "data" : function(a) { 
          if(a.owned_name && a.owned_ico) { return a.owned_name + ' (' + a.owned_ico + ')'; }
          else if(a.owned_name) { return a.owned_name; }
          else if(a.owned_ico) { return a.owned_ico; }
          return 'N/A';
          }
        },
        { "data" : function(a) {
          if(a.owner_name) { 
            if(a.owner_ico) { return a.owner_name + ' (' + a.owner_ico + ')'; }
            if(a.owner_type == 'person') { return toTitleCase(a.owner_name); }
            return a.owner_name; 
          }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.owner_country) { return a.owner_country; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.owner_zapisDatum) { return a.owner_zapisDatum; }
          return 'N/A';
          }
        },
        { "data" : function(a) { 
          if(a.owner_vymazDatum) { return a.owner_vymazDatum; }
          return 'N/A';
          }
        }
      ]
    });
  }

  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension2.top(Infinity);
      charts.table.chart.fnClearTable();
      charts.table.chart.fnAddData(alldata);
      charts.table.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  //TODO - EDIT SO THAT IT WORKS FOR THE 2 DATASETS
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          filterDonors();
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    vuedata.resetInProgress = true;
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    searchDimension2.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
    vuedata.resetInProgress = false;
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createTopDonorsPersonChart();
  createTopDonorsBusinessChart();
  createTopDonorsPersonIndirectChart();
  createEntityTypeChart();
  createYearsChart();
  createPartiesChart();
  /*
  createTopDonorsBusinessChart();
  createEntityTypeChart();
  createYearsChart();
  createPartiesChart();
  */
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all)
    .formatNumber(locale.format(",d"));
  counter.render();
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Main counter donors
  var all2 = ndx2.groupAll();
  var counter2 = dc.dataCount('.dc-data-count2')
    .dimension(ndx2)
    .group(all2)
    .formatNumber(locale.format(",d"));
  counter2.render();
  counter2.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});
});
