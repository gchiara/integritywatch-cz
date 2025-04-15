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
  page: 'parties',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  selectedMandate: 'all',
  selectedYear: 2022,
  years: [2017,2018,2019,2020,2021,2022],
  modalShowTable: 'b',
  charts: {
    donations: {
      title: 'Objem darů a bezúplatných plnění',
      info: 'Součet peněžitých darů a hodnoty bezúplatných plnění za daný rok v celých tisících Kč.'
    },
    donationsNum: {
      title: 'Počet darů a bezúplatných plnění',
      info: 'Počet jednotlivých darů a bezúplatných plnění za daný rok.'
    },
    incomeShares: {
      title: 'Příjmy politických stran podle zdroje',
      info: 'Rozbor příjmů stran podle jejich zdroje: fyzické osoby, právnické osoby a finance od státu. Kategorie „Jiné zdroje“ obsahuje všechny příjmy nespojené s přímou podporou strany od soukromých osob, firem či státu. Kvůli finančním nesrovnalostem ve zdrojích, ze kterých graf čerpá, v některých případech může součet podílů převyšovat 100 %.'
    },
    income: {
      title: 'Celkové příjmy dle strany',
      info: 'Celkové příjmy vykázané ve výročních finančních zprávách stran za daný rok.'
    },
    expenses: {
      title: 'Celkové výdaje dle strany',
      info: 'Celkové výdaje vykázané ve výročních finančních zprávách stran za daný rok.'
    },
    topDonorPercent: {
      title: 'Podíl 5 největších dárců v rámci celkového příjmu strany',
      info: 'Graf zobrazuje kombinovaný podíl pěti největších dárců stran na jejich celkovém příjmu v daném roce. Pomáhá tak identifikovat strany, které jsou z velké části financovány malou skupinou podporovatelů. Významným dárcem může ovšem být i jiná politická strana. V takových případech se nejedná o dary, ale o rozdělování státních příspěvků mezi členy volební koalice na základě koaliční smlouvy.'
    },
    incomeType: {
      title: 'Příjem dle kategorie',
      info: 'Příjmy vykázané stranami podle kategorií příjmů stanovených vyhláškou č. 114/2017 Sb.'
    },
    expensesType: {
      title: 'Výdaje dle kategorie',
      info: 'Výdaje vykázané stranami podle kategorií výdajů stanovených vyhláškou č. 114/2017 Sb.'
    },
    subsidiesType: {
      title: 'Státní příspěvky dle typu',
      info: 'Strany mají za určitých podmínek nárok na různé typy příspěvků ze státního rozpočtu, které stanovují § 20-20b zákona č. 424/1991 Sb.'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Strany',
      info: 'Tabulka poskytuje přehled celkových příjmů, výdajů, státních příspěvků, darů a bezúplatných plnění všech sledovaných stran za vybraný rok. Klikněte na stranu pro kompletní přehled darů a bezúplatných plnění, státních příspěvků a výčet pěti největších dárců za celé sledované období. Dary lze vyhledávat a řadit podle jména/názvu a data narození/IČO dárce nebo data, popisu, typu a výše daru.'
    }
  },
  selectedEl: {"Name": ""},
  stateContributionLabels: {
    "poslanci": "Příspěvek na mandát – poslanci",
    "kraj. zast.": "Příspěvek na mandát – členové zastupitelstva kraje",
    "stálý příspěvek": "Stálý příspěvek na činnost",
    "senátoři": "Příspěvek na mandát – senátoři",
    "příspěvek na podporu činnosti politického institutu": "Příspěvek na podporu činnosti politického institutu",
    "příspěvek na činnost za minulý rok": "Příspěvek na činnost za minulý rok",
    "příspěvek na podporu činnosti politického institutu za minulý rok": "Příspěvek na podporu činnosti politického institutu za minulý rok",
    "příspěvek na úhradu volebních nákladů": "Příspěvek na úhradu volebních nákladů",
    "zast. hl.m. Prahy": "Příspěvek na mandát – členové zastupitelstva hlavního města Prahy"
  },
  colors: {
    default: "#009fe2",
    range: ["#62aad9", "#3b95d0", "#085c9c", "#063e69", "#e3b419", "#e39219", "#de7010", "#c9530e"],
    colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"],
    numPies: {
      "0": "#ddd",
      "1": "#ff516a",
      "2": "#f43461",
      "3": "#e51f5c",
      "4": "#d31a60",
      ">5": "#bb1d60"
    },
    shares: {
      "Příspěvky ze státního rozpočtu ČR": "#009fe2",
      "Individuální dary": "#e3b419",
      "Firemní dary": "#de8d02",
      "Jiné zdroje příjmu (příjmy z nájmu, z pořádání akcí, úroky apod.)": "#ccc",
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
    getPercentOfIncome: function(amt,income) {
      if(income == 0) { return 'N/A'; }
      return parseFloat(amt/income*100).toFixed(2).replace('.',',') + ' %';
    },
    formatValue: function(x){
      if(parseInt(x)){
        return x.toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      return x;
    },
    formatTopDonorsBirthdate: function(str){
      var splitStr = str.split('(');
      if(splitStr.length == 2) {
        var splitDate = splitStr[1].replace(')','').trim().split('-');
        if(splitDate.length == 3 && splitDate[0].length == 4) {
          return splitStr[0] + '(' + splitDate[2] + '.' + splitDate[1] + '.' + splitDate[0] + ')';
        }
      }
      return str;
    },
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Integrity Watch Česká republika ' + thisPage;
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
  income: {
    chart: dc.rowChart("#income_chart"),
    type: 'row',
    divId: 'income_chart'
  },
  expenses: {
    chart: dc.rowChart("#expenses_chart"),
    type: 'row',
    divId: 'expenses_chart'
  },
  incomeShares: {
    chart: dc.pieChart("#incomeshares_chart"),
    type: 'pie',
    divId: 'incomeshares_chart'
  },
  donations: {
    chart: dc.rowChart("#donations_chart"),
    type: 'row',
    divId: 'donations_chart'
  },
  donationsNum: {
    chart: dc.rowChart("#donationsnum_chart"),
    type: 'row',
    divId: 'donationsnum_chart'
  },
  /*
  subsidies: {
    chart: dc.rowChart("#subsidies_chart"),
    type: 'row',
    divId: 'subsidies_chart'
  },
  */
  topDonorPercent: {
    chart: dc.rowChart("#topdonorpercent_chart"),
    type: 'row',
    divId: 'topdonorpercent_chart'
  },
  incomeType: {
    chart: dc.pieChart("#incometype_chart"),
    type: 'pie',
    divId: 'incometype_chart'
  },
  expensesType: {
    chart: dc.pieChart("#expensestype_chart"),
    type: 'pie',
    divId: 'expensestype_chart'
  },
  subsidiesType: {
    chart: dc.pieChart("#subsidiestype_chart"),
    type: 'pie',
    divId: 'subsidiestype_chart'
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
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      var charsLength = recalcCharsLength(sizes.width);
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(8).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
          var thisKey = d.name;
          if(thisKey == 'Others') {
            thisKey = 'Ostatní';
          }
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        }));
        //.legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud());
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
function formatValueThousands(x){
  if(parseInt(x)){
    if(x > 1000){
      return (x/1000).toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' tis.';
    }
    return x.toString().replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  return x;
}
function capitalizeFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
  "czstring-pre": function (str) {
      return str.replace('Č','C');
  },
  "czstring-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "czstring-desc": function ( a, b ) {
    return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

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

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var urlYear = getParameterByName('y');
if(urlYear && vuedata.years.indexOf(parseInt(urlYear)) > -1) {
  vuedata.selectedYear = parseInt(urlYear);
} else {
  vuedata.selectedYear = 2022;
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

json('./data/parties.json?' + randomPar, (err, parties) => {
  //Parse data
  if(vuedata.selectedYear < 2021) {
    parties = _.filter(parties, function (x) { return x.id !== '10742409'; })
  }
  _.each(parties, function (d) {
    if(!vuedata.colors.parties[d.abbreviation_charts]) {
      vuedata.colors.parties[d.abbreviation_charts] = d.color;
    }
    d.yearsList = [];
    for (var key in d.years) {
      d.yearsList.push(key);
      d.years[key].y = key;
      //Make incomeshares dataset
      d.years[key].incomeShares = [];
      d.years[key].incomeShares.push({'type': 'Příspěvky ze státního rozpočtu ČR', 'amt': d.years[key].subsidiesAmtTot});
      d.years[key].incomeShares.push({'type': 'Individuální dary', 'amt': d.years[key].donationsAmtIndividual});
      d.years[key].incomeShares.push({'type': 'Firemní dary', 'amt': d.years[key].donationsAmtBusiness});
      if(d.years[key].incomeTot == 0) {
        d.years[key].incomeShares.push({'type': 'Jiné zdroje příjmu (příjmy z nájmu, z pořádání akcí, úroky apod.)', 'amt': 0});
      } else {
        d.years[key].incomeShares.push(
          {'type': 'Jiné zdroje příjmu (příjmy z nájmu, z pořádání akcí, úroky apod.)', 
          'amt': d.years[key].incomeTot - ( d.years[key].subsidiesAmtTot + d.years[key].donationsAmtIndividual + d.years[key].donationsAmtBusiness )
          }
        );
      }
    };
    d.yearsList.reverse();
    _.each(d.years, function (y) {
      //Get max income percentage from single donor and turn it into range
      y.maxIncomePercentageFromSingleDonor = 'N/A';
      y.maxIncomePercentageFromSingleDonorRange = 'N/A';
      if(y.topDonors && y.incomeTot > 0) {
        var topDonor = y.topDonors[0][1];
        y.maxIncomePercentageFromSingleDonor = (topDonor/y.incomeTot)*100;
        if(y.maxIncomePercentageFromSingleDonor <= 1) {
          y.maxIncomePercentageFromSingleDonorRange = '0% - 1%';
        } else if(y.maxIncomePercentageFromSingleDonor <= 3) {
          y.maxIncomePercentageFromSingleDonorRange = '1% - 3%';
        } else if(y.maxIncomePercentageFromSingleDonor <= 5) {
          y.maxIncomePercentageFromSingleDonorRange = '3% - 5%';
        } else if(y.maxIncomePercentageFromSingleDonor <= 7) {
          y.maxIncomePercentageFromSingleDonorRange = '5% - 7%';
        } else if(y.maxIncomePercentageFromSingleDonor <= 10) {
          y.maxIncomePercentageFromSingleDonorRange = '7% - 10%';
        } else if(y.maxIncomePercentageFromSingleDonor > 10) {
          y.maxIncomePercentageFromSingleDonorRange = '> 10%';
        }
      }
      //Get total income percentage by top 5 donors
      y.incomePercentageFromTop5Donors = 0;
      if(y.topDonors && y.incomeTot > 0) {
        var totDonationsAmtFromTop5Donors = 0;
        _.each(y.topDonors, function (y) {
          totDonationsAmtFromTop5Donors += y[1];
        });
        y.incomePercentageFromTop5Donors = (totDonationsAmtFromTop5Donors/y.incomeTot)*100;
      }
      //console.log(y.incomePercentageFromTop5Donors);
    });
    d.yearData = d.years[vuedata.selectedYear];
    if(!d.yearData) {
      d.yearDataNotPresent = true;
      d.yearData = {
        "donationsAmtMonetary": 0,
        "donationsAmtService": 0,
        "donationsNumMonetary": 0,
        "donationsNumService": 0,
        "expensesTot": 0,
        "incomeTot": 0,
        "subsidiesAmtTot": 0,
        "maxIncomePercentageFromSingleDonorRange": 'N/A',
        "incomeShares": []
      }
    }
    //Get year incomes, expenses and state contributions
    d.yearData.incomeEntries = _.filter(d.incomeAndExpenses, function (x) { return x.year == vuedata.selectedYear && x.amountClean > 0; })
    d.yearData.expensesEntries = _.filter(d.incomeAndExpenses, function (x) { return x.year == vuedata.selectedYear && x.amountClean < 0; })
    d.yearData.subsidiesEntries = _.filter(d.subsidies, function (x) { return x.year == vuedata.selectedYear; })
    _.each(d.yearData.subsidiesEntries, function (s) {
        s.contributionTypeLabel = s.contributionType;
        if(vuedata.stateContributionLabels[s.contributionType]) {
          s.contributionTypeLabel = vuedata.stateContributionLabels[s.contributionType];
        }
    });
  });

  //Set dc main vars
  var ndx = crossfilter(parties);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.display_name + " " + d.id;
      return entryString.toLowerCase();
  });

  //CHART 2 - Donations
  var createDonationsChart = function() {
    var chart = charts.donations.chart;
    var dimension = ndx.dimension(function (d) {
        return d.abbreviation_charts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.yearData.donationsAmtMonetary + d.yearData.donationsAmtService;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.donations.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(425)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
      //.xAxis().ticks(3).tickFormat(function(d) { return addcommas(d) + ' Kč' });
    chart.render();
  }

  //CHART 3 - Donations number
  var createDonationsNumChart = function() {
    var chart = charts.donationsNum.chart;
    var dimension = ndx.dimension(function (d) {
        return d.abbreviation_charts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.yearData.donationsNumMonetary + d.yearData.donationsNumService;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.donationsNum.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(425)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value) + ' donations';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValue(d) + '' });;
    chart.render();
  }

  /* Custom reduce functions */
  var sharesReduceAdd = function(p,v) {
    v.yearData.incomeShares.forEach(function(share) {
    var type = share.type;
    p[type] = (p[type] || 0) + (share.amt || 0);
    })
    return p;
  }
  var sharesReduceRemove = function(p,v) {
    v.yearData.incomeShares.forEach(function(share) {
    var type = share.type;
    p[type] = (p[type] || 0) - (share.amt || 0);
    })
    return p;
  }
  var sharesReduceInit = function() {
    return {};
  }

  //CHART 3 - Income Shares
  var createIncomeSharesChart = function() {
    var chart = charts.incomeShares.chart;
    var dimension = ndx.dimension(function (d) {
      return d.yearData.incomeShares;
    });
    var group = dimension.group().reduceSum(function (d) { return d.amt; });
    var dimension = ndx.dimension(r => r.yearData.incomeShares.map(c => c.type), true);
    var group = dimension.group().reduce(sharesReduceAdd, sharesReduceRemove, sharesReduceInit);
    var sizes = calcPieSize(charts.incomeShares.divId);
    var charsLength = recalcCharsLength(sizes.width);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .cap(7)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .dimension(dimension)
      .group(group)
      .keyAccessor(function(d) { return d.key;})
      .valueAccessor(d => d.value[d.key])
      .legend(dc.legend().x(0).y(sizes.legendY).gap(8).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
        percent = percent*100;
        return thisKey + ': ' + formatValue(d.value[d.key].toFixed(2)) + ' Kč' + ' (' + percent.toFixed(1).replace('.',',') +'  %)';
      })
      .label(function (d){
        var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
        percent = percent*100;
        return percent.toFixed(1).replace('.',',') + ' %';
      })
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A") {
          return "#ddd";
        }
        return vuedata.colors.shares[d.key]
      });
    chart.filter = function() {};
    chart.render();
  }

  //CHART 4 - State contributions
  var createSubsidiesChart = function() {
    var chart = charts.subsidies.chart;
    var dimension = ndx.dimension(function (d) {
        return d.abbreviation_charts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.yearData.subsidiesAmtTot;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.subsidies.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(425)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
  }

  //CHART 5 - Income
  var createIncomeChart = function() {
    var chart = charts.income.chart;
    var dimension = ndx.dimension(function (d) {
        return d.abbreviation_charts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.yearData.incomeTot;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.income.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(425)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
  }

  //CHART 6 - Expenses
  var createExpensesChart = function() {
    var chart = charts.expenses.chart;
    var dimension = ndx.dimension(function (d) {
        return d.abbreviation_charts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return Math.abs(d.yearData.expensesTot);
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.expenses.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(425)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' Kč' });
    chart.render();
  }

  //CHART 6 Replacement - Income percentage by top 5 donors
  var createTopDonorPercentChart2 = function() {
    var chart = charts.topDonorPercent.chart;
    var dimension = ndx.dimension(function (d) {
        return d.abbreviation_charts;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.yearData.incomePercentageFromTop5Donors.toFixed(1);
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(20).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDonorPercent.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(405)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value.toFixed(1)) + ' %';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + ' %' });
    chart.render();
  }

  //CHART 6 - Max income percentage from single donor
  var createTopDonorPercentChart = function() {
    var chart = charts.topDonorPercent.chart;
    var dimension = ndx.dimension(function (d) {
        return d.yearData.maxIncomePercentageFromSingleDonorRange;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.topDonorPercent.divId);
    var charsLength = recalcCharsLength(width);
    var order = ['> 10%', '7% - 10%', '5% - 7%', '3% - 5%', '1% - 3%', '0% - 1%', 'N/A']
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(group)
      .dimension(dimension)
      .ordering(function(d) { return order.indexOf(d.key)})
      .gap(15)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatValue(d.value) + ' parties';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return formatValueThousands(d) + '' });
    chart.render();
  }

  /* Custom reduce functions */
  var incomeTypeReduceAdd = function(p,v) {
    v.yearData.incomeEntries.forEach(function(entry) {
    var type = capitalizeFirstChar(entry.description);
    p[type] = (p[type] || 0) + (entry.amountClean || 0);
    })
    return p;
  }
  var incomeTypeReduceRemove = function(p,v) {
    v.yearData.incomeEntries.forEach(function(entry) {
    var type = capitalizeFirstChar(entry.description);
    p[type] = (p[type] || 0) - (entry.amountClean || 0);
    })
    return p;
  }
  var incomeTypeReduceInit = function() {
    return {};
  }

  //CHART 7 - Income Type
  var createIncomeTypeChart = function() {
    var chart = charts.incomeType.chart;
    var dimension = ndx.dimension(r => r.yearData.incomeEntries.map(c => capitalizeFirstChar(c.description)), true);
    var group = dimension.group().reduce(incomeTypeReduceAdd, incomeTypeReduceRemove, incomeTypeReduceInit);
    var sizes = calcPieSize(charts.incomeType.divId);
    var charsLength = recalcCharsLength(sizes.width);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .dimension(dimension)
      .group(group)
      .keyAccessor(function(d) { return d.key;})
      .valueAccessor(d => d.value[d.key])
      .ordering(function(d) { return -d.value[d.key];})
      .cap(6)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(8).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey == 'Others') {
          thisKey = 'Ostatní';
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        if(thisKey == 'Others') {
          thisKey = 'Ostatní';
        }
        if(d.value[d.key] || d.value[d.key] == 0) {
          var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
          percent = percent*100;
          return thisKey + ': ' + formatValue(d.value[d.key].toFixed(2)) + ' Kč' + ' (' + percent.toFixed(1).replace('.',',') +' %)';
        } else { 
          return thisKey + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
        }
      })
      .label(function (d){
        if(d.value[d.key]) {
          var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
          percent = percent*100;
          return percent.toFixed(1).replace('.',',') + ' %';
        } else {
          return '';
        }
      })
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      });
    chart.filter = function() {};
    chart.render();
  }

  /* Custom reduce functions */
  var expensesTypeReduceAdd = function(p,v) {
    v.yearData.expensesEntries.forEach(function(entry) {
    var type = capitalizeFirstChar(entry.description);
    p[type] = (p[type] || 0) + (Math.abs(entry.amountClean) || 0);
    })
    return p;
  }
  var expensesTypeReduceRemove = function(p,v) {
    v.yearData.expensesEntries.forEach(function(entry) {
    var type = capitalizeFirstChar(entry.description);
    p[type] = (p[type] || 0) - (Math.abs(entry.amountClean) || 0);
    })
    return p;
  }
  var expensesTypeReduceInit = function() {
    return {};
  }

  //CHART 7 - Expenses Type
  var createExpensesTypeChart = function() {
    var chart = charts.expensesType.chart;
    var dimension = ndx.dimension(r => r.yearData.expensesEntries.map(c => capitalizeFirstChar(c.description)), true);
    var group = dimension.group().reduce(expensesTypeReduceAdd, expensesTypeReduceRemove, expensesTypeReduceInit);
    var sizes = calcPieSize(charts.expensesType.divId);
    var charsLength = recalcCharsLength(sizes.width);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .dimension(dimension)
      .group(group)
      .keyAccessor(function(d) { return d.key;})
      .valueAccessor(d => d.value[d.key])
      .ordering(function(d) { return -d.value[d.key];})
      .cap(6)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(8).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey == 'Others') {
          thisKey = 'Ostatní';
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        if(thisKey == 'Others') {
          thisKey = 'Ostatní';
        }
        if(d.value[d.key] || d.value[d.key] == 0) {
          var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
          percent = percent*100;
          return thisKey + ': ' + formatValue(d.value[d.key].toFixed(2)) + ' Kč' + ' (' + percent.toFixed(1).replace('.',',') +' %)';
        } else { 
          if(isNaN(d.value)) { return thisKey + ': ' + d.value + ' Kč';  }
          return thisKey + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
        }
      })
      .label(function (d){
        if(d.value[d.key]) {
          var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
          percent = percent*100;
          return percent.toFixed(1).replace('.',',') + ' %';
        } else {
          return '';
        }
      })
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      });
    chart.filter = function() {};
    chart.render();
  }

  /* Custom reduce functions */
  var subsidiesTypeReduceAdd = function(p,v) {
    v.yearData.subsidiesEntries.forEach(function(entry) {
    var type = entry.contributionTypeLabel;
    p[type] = (p[type] || 0) + (entry.amount || 0);
    })
    return p;
  }
  var subsidiesTypeReduceRemove = function(p,v) {
    v.yearData.subsidiesEntries.forEach(function(entry) {
    var type = entry.contributionTypeLabel;
    p[type] = (p[type] || 0) - (entry.amount || 0);
    })
    return p;
  }
  var subsidiesTypeReduceInit = function() {
    return {};
  }

  //CHART 7 - Subsidies Type
  var createSubsidiesTypeChart = function() {
    var chart = charts.subsidiesType.chart;
    var dimension = ndx.dimension(r => r.yearData.subsidiesEntries.map(c => c.contributionTypeLabel), true);
    var group = dimension.group().reduce(subsidiesTypeReduceAdd, subsidiesTypeReduceRemove, subsidiesTypeReduceInit);
    var sizes = calcPieSize(charts.subsidiesType.divId);
    var charsLength = recalcCharsLength(sizes.width);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .dimension(dimension)
      .group(group)
      .keyAccessor(function(d) { return d.key;})
      .valueAccessor(d => d.value[d.key])
      .ordering(function(d) {return -d.value[d.key];})
      .cap(6)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(8).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey == 'Others') {
          thisKey = 'Ostatní';
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        if(thisKey == 'Others') {
          thisKey = 'Ostatní';
        }
        if(d.value[d.key] || d.value[d.key] == 0) {
          var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
          percent = percent*100;
          return thisKey + ': ' + formatValue(d.value[d.key].toFixed(2)) + ' Kč' + ' (' + percent.toFixed(1) +' %)';
        } else { 
          return thisKey + ': ' + formatValue(d.value.toFixed(2)) + ' Kč';
        }
      })
      .label(function (d){
        if(d.value[d.key]) {
          var percent = d.value[d.key] / group.all().reduce(function(a, v){ return a + v.value[v.key]; }, 0);
          percent = percent*100;
          return percent.toFixed(1).replace('.',',') + ' %';
        } else {
          return '';
        }
      })
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      });
    chart.filter = function() {};
    chart.render();
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
      "language": {
        "info": "Zobrazeno _START_ až _END_ z _TOTAL_ položek",
        "lengthMenu": "Zobrazit _MENU_ položek",
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
          "type": "czstring",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.display_name) {
              return d.display_name;
            }
            return "N/A";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.yearData && d.yearData.incomeTot) {
              return formatValue(d.yearData.incomeTot.toFixed(2)) + ' Kč';
            }
            return "N/A";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.yearData && d.yearData.expensesTot) {
              return formatValue(d.yearData.expensesTot.toFixed(2)) + ' Kč';
            }
            return "N/A";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.yearData && d.yearData.subsidiesAmtTot) {
              return formatValue(d.yearData.subsidiesAmtTot.toFixed(2)) + ' Kč';
            }
            return "N/A";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.yearData && d.yearData.donationsAmtMonetary) {
              return formatValue(d.yearData.donationsAmtMonetary.toFixed(2)) + ' Kč';
            }
            return "N/A";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "type": "currency-amt",
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.yearData && d.yearData.donationsAmtService) {
              return formatValue(d.yearData.donationsAmtService.toFixed(2)) + ' Kč';
            }
            return "N/A";
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
      "aaData": searchDimension.top(Infinity),
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
      vuedata.modalShowTable = 'b';
      vuedata.selectedEl = data;
      $('#detailsModal').modal();
      vuedata.selectedEl.subsidies = _.filter(vuedata.selectedEl.subsidies, function (x) { return x.year >= 2017; })
      InitializeSubsidiesTable();
      if(data.donations.length > 0) {
        _.each(data.donations, function (don) {
          don.amount = don.amt;
          if(don.donorType == 'person') {
            don.from = don.donorName;
          } else if(don.donorType == 'legal entity') {
            don.from = don.donorName + ' (' + don.donorIcoDoB + ')';
          }
        });
        InitializeDonationsTable();
      }
    });
  }

  function InitializeSubsidiesTable() {
    var dTable = $("#modalSubsidiesTable");
    dTable.DataTable ({
      "data" : vuedata.selectedEl.subsidies,
      "destroy": true,
      "search": true,
      "pageLength": 10,
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
          if(a.year) { return a.year; }
          return "N/A";
          }
        },
        { "data" : function(a) { 
            if(a.contributionType) { return a.contributionType; }
            return "N/A";
          }
        },
        { "type": "currency-amt",
          "data" : function(a) { 
            if(a.amount) { return formatValue(a.amount) + ' Kč'; }
            return "N/A";
          } 
        }
      ]
    });
  }

  function InitializeDonationsTable() {
    var dTable = $("#modalDonationsTable");
    dTable.DataTable ({
      "data" : vuedata.selectedEl.donations,
      "destroy": true,
      "search": true,
      "pageLength": 10,
      "dom": '<<f><t>pi>',
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
          return a.year;
          }
        },
        { "data" : function(a) { 
            if(a.type) { 

              if(a.type == 'service') {
                if(a.amount < 0 ) {
                   return 'Bezúplatné plnění (Vracený dar)';
                }
                return 'Bezúplatné plnění';
              } else if(a.type == 'monetary') {
                if(a.amount < 0 ) {
                  return 'Peněžitý dar (Vracený dar)';
                }
                return 'Peněžitý dar';
              } else {
                if(a.amount < 0 ) {
                  return a.type + ' (Vracený dar)';
                }
                return a.type;
              }
            }
            return "N/A";
          }
        },
        { "data" : function(a) { 
            if(a.donorName) { 
              if(a.donorType == 'person') { return toTitleCase(a.donorName); }
              return a.donorName; 
            }
            return "N/A";
          }
        },
        { "data" : function(a) { 
          if(a.donorIcoDoB) { return a.donorIcoDoB; }
          return "N/A";
          }
        },
        { "data" : function(a) { 
          if(a.description) { return a.description; }
          return "N/A";
        }
        },
        { "type": "currency-amt",
          "data" : function(a) { 
            return formatValue(a.amount) + ' Kč';
          } 
        }
      ]
    });
  }


  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.table.chart.fnClearTable();
      charts.table.chart.fnAddData(alldata);
      charts.table.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
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
      return d.indexOf(s.toLowerCase()) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  //createFlagsChart();
  createIncomeSharesChart();
  createDonationsChart();
  createDonationsNumChart();
  //createSubsidiesChart();
  createIncomeChart();
  createExpensesChart();
  createTopDonorPercentChart2();
  createIncomeTypeChart();
  createExpensesTypeChart();
  createSubsidiesTypeChart();
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

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});
