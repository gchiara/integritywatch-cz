<html lang="en">
<head>
  <?php include 'gtag.php' ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Integrity Watch Česká republika</title>
  <meta property="og:url" content="https://www.integritywatch.cz" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Integrity Watch Česká republika" />
  <meta property="og:description" content="Integrity Watch Česká republika" />
  <meta property="og:image" content="http://www.integritywatch.cz/images/thumbnail.jpg" />
  <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700,800" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
  <link rel="stylesheet" href="fonts/oswald.css">
  <link rel="stylesheet" href="static/parties.css?v=9">
</head>
<body>
    <div id="app" class="parties-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Integrity Watch Česká republika<br />Strany {{ selectedYear }}</h1>
              <h2>Sekce sleduje hospodáření 11 vybraných politických stran a hnutí za období 2017-2022</h2>
              <a class="read-more-btn" href="./about.php">O projektu</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/x.png" />Sdílet na X</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Sdílet na Facebook</button>
              <p>Data můžete filtrovat kliknutím na vybraný subjekt nebo kategorii přímo v grafu</p>
            </div>
          </div>
        </div>
      </div>
      <!-- YEAR SELECTOR -->
      <div class="container-fluid year-selector-bar">
        <div class="row year-selector-bar-content">
          <div class="col-md-12">
            <span v-for="y in years">
              <a :href="'./index.php?y='+y" :class="{active: selectedYear == y}">{{y}}</a>
            </span>
          </div>
        </div>
      </div>
      <!-- MAIN -->
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_1">
              <chart-header :title="charts.income.title" :info="charts.income.info" ></chart-header>
              <div class="chart-inner" id="income_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_2">
              <chart-header :title="charts.expenses.title" :info="charts.expenses.info" ></chart-header>
              <div class="chart-inner" id="expenses_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_3">
              <chart-header :title="charts.incomeShares.title" :info="charts.incomeShares.info" ></chart-header>
              <div class="chart-inner" id="incomeshares_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_4">
              <chart-header :title="charts.donations.title" :info="charts.donations.info" ></chart-header>
              <div class="chart-inner" id="donations_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_5">
              <chart-header :title="charts.donationsNum.title" :info="charts.donationsNum.info" ></chart-header>
              <div class="chart-inner" id="donationsnum_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_6">
              <chart-header :title="charts.topDonorPercent.title" :info="charts.topDonorPercent.info" ></chart-header>
              <div class="chart-inner" id="topdonorpercent_chart"></div>
            </div>
          </div>
          <!--
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_4">
              <chart-header :title="charts.subsidies.title" :info="charts.subsidies.info" ></chart-header>
              <div class="chart-inner" id="subsidies_chart"></div>
            </div>
          </div>
          -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_7">
              <chart-header :title="charts.incomeType.title" :info="charts.incomeType.info" ></chart-header>
              <div class="chart-inner" id="incometype_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_8">
              <chart-header :title="charts.expensesType.title" :info="charts.expensesType.info" ></chart-header>
              <div class="chart-inner" id="expensestype_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container parties_9">
              <chart-header :title="charts.subsidiesType.title" :info="charts.subsidiesType.info" ></chart-header>
              <div class="chart-inner" id="subsidiestype_chart"></div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.table.title" :info="charts.table.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">#</th> 
                      <th class="header">Název</th>
                      <th class="header">Příjmy</th>
                      <th class="header">Výdaje</th>
                      <th class="header">Státní příspěvky</th>
                      <th class="header">Peněžité dary</th>
                      <th class="header">Bezúplatná plnění</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filtrovat podle jména nebo IČO strany">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              Zobrazeno<div class="filter-count">0</div>stran z <strong class="total-count">0</strong>
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Zrušit filtr</span></button>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="name">{{ selectedEl.display_name }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="details-tables-buttons">
                    <button @click="modalShowTable = 'b'" :class="{active: modalShowTable == 'b'}" v-show="selectedEl.donations && selectedEl.donations.length > 0">Dary a bezúplataná plnění</button>
                    <button @click="modalShowTable = 'c'" :class="{active: modalShowTable == 'c'}" v-show="selectedEl.donations && selectedEl.donations.length > 0">Největší dárci</button>
                    <button @click="modalShowTable = 'a'" :class="{active: modalShowTable == 'a'}" v-show="selectedEl.subsidies">Státní příspěvky</button>
                  </div>
                  <div class="col-md-12" v-show="modalShowTable == 'a' && selectedEl.subsidies">
                    <div class="details-table-title">Státní příspěvky</div>
                    <table id="modalSubsidiesTable" class="modal-interactive-table">
                      <thead>
                        <tr><th>Rok</th><th>Typ příspěvku</th><th>Výše</th></tr>
                      </thead>
                    </table>
                  </div>
                  <div class="col-md-12" v-show="modalShowTable == 'b' && selectedEl.donations">
                    <div class="details-table-title">Dary a bezúplataná plnění</div>
                    <table id="modalDonationsTable" class="modal-interactive-table">
                      <thead>
                        <tr><th>Datum</th><th>Typ</th><th>Dárce</th><th>Datum narození nebo IČO</th><th>Popis (bezúplatná plnění)</th><th>Výše</th></tr>
                      </thead>
                    </table>
                  </div>
                  <div class="col-md-12" v-show="modalShowTable == 'c' && selectedEl.donations">
                    <div class="details-table-title">Největší dárci</div>
                    <div v-for="y,i in selectedEl.yearsList">
                      <div v-if="selectedEl.years[y].topDonors" class="details-table-subtitle">{{ selectedEl.years[y].y }}</div>
                      <table v-if="selectedEl.years[y].topDonors" class="modal-interactive-table">
                        <thead>
                          <tr><th>Dárce</th><th>Výše</th><th>Podíl na celkových příjmech strany</th></tr>
                        </thead>
                        <tbody>
                          <tr v-for="donor in selectedEl.years[y].topDonors">
                            <td>{{ formatTopDonorsBirthdate(donor[0]) }}</td>
                            <td>{{ formatValue(donor[1].toFixed(2)) + ' Kč' }}</td>
                            <td>{{ getPercentOfIncome(donor[1], selectedEl.years[y].incomeTot) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="''" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/parties.js?v=9"></script>

 
</body>
</html>