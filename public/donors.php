<html lang="en">
<head>
  <?php include 'gtag.php' ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Integrity Watch Czech Republic</title>
  <meta property="og:url" content="https://www.integritywatch.cz" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Integrity Watch Czech Republic" />
  <meta property="og:description" content="Integrity Watch Czech Republic" />
  <meta property="og:image" content="http://www.integritywatch.eu/images/thumbnail.jpg" />
  <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700,800" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
  <link rel="stylesheet" href="fonts/oswald.css">
  <link rel="stylesheet" href="static/donors.css?v=6">
</head>
<body>
    <div id="app" class="donors-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Integrity Watch Česká republika | Dárci</h1>
              <h2>Sekce sleduje individuální a firemní dárce vybraných politických stran a hnutí za období 2017-2022</h2>
              <a class="read-more-btn" href="./about.php">O projektu</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Sdílet na X</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Sdílet na Facebook</button>
              <p>Data můžete filtrovat kliknutím na vybraný subjekt nebo kategorii přímo v grafu</p>
            </div>
          </div>
        </div>
      </div>
      <!-- MAIN -->
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.topDonorsPerson.title" :info="charts.topDonorsPerson.info" ></chart-header>
              <div class="chart-inner" id="topdonorsperson_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.topDonorsBusiness.title" :info="charts.topDonorsBusiness.info" ></chart-header>
              <div class="chart-inner" id="topdonorsbusiness_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.topDonorsPersonIndirect.title" :info="charts.topDonorsPersonIndirect.info" ></chart-header>
              <div class="chart-inner" id="topdonorspersonindirect_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.entityType.title" :info="charts.entityType.info" ></chart-header>
              <div class="chart-inner" id="entitytype_chart"></div>
            </div>
          </div>
          <div class="col-md-5 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.years.title" :info="charts.years.info" ></chart-header>
              <div class="chart-inner" id="years_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.parties.title" :info="charts.parties.info" ></chart-header>
              <div class="chart-inner" id="parties_chart"></div>
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
                      <th class="header">Jméno nebo název</th>
                      <th class="header">Datum narození nebo IČO</th>
                      <th class="header">Typ dárce</th>
                      <th class="header">Výše přímých darů</th>
                      <th class="header">Výše nepřímých darů</th> 
                      <th class="header">Celková výše přesahuje zákonný limit</th>
                      <th class="header">Dárce vlastněn zahraniční osobou</th> 
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
              <input type="text" id="search-input" placeholder="Filtrovat podle jména nebo IČO individuálního či firemního dárce">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count2 count-box">
              Zobrazeno <div class="filter-count">0</div>dárců z <strong class="total-count">0</strong>
            </div>
            <div class="dc-data-count count-box">
              Zobrazeno <div class="filter-count">0</div>darů z <strong class="total-count">0</strong>
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
                <div class="name" v-if="selectedEl.donorType == 'legal entity'">{{ selectedEl.donorName }}</div>
                <div class="name" v-else>{{ selectedEl.donorNameTitleCase }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="details-tables-buttons">
                    <button @click="modalShowTable = 'a'" :class="{active: modalShowTable == 'a'}">Přehled</button>
                    <button @click="modalShowTable = 'b'" :class="{active: modalShowTable == 'b'}" v-show="(selectedEl.donations && selectedEl.donations.length > 0) || (selectedEl.indirectDonations && selectedEl.indirectDonations.length > 0)">Dary</button>
                    <button @click="modalShowTable = 'c'" :class="{active: modalShowTable == 'c'}" v-show="selectedEl.ownershipStructure && selectedEl.ownershipStructure.bo && selectedEl.ownershipStructure.bo.length > 0">Skuteční majitelé</button>
                    <button @click="modalShowTable = 'd'" :class="{active: modalShowTable == 'd'}" v-show="selectedEl.ownershipStructure && selectedEl.ownershipStructure.owners && selectedEl.ownershipStructure.owners.length > 0">Vlastnická struktura</button>
                    <button @click="modalShowTable = 'e'" :class="{active: modalShowTable == 'e'}" v-show="selectedEl.entities && selectedEl.entities.length > 0">Ovládané právnické osoby</button>
                  </div>
                  <!-- Overview -->
                  <div class="col-md-12" v-show="modalShowTable == 'a'">
                    <div v-if="selectedEl.donorType == 'legal entity'">
                      <div class="details-line"><span class="details-line-title">Název:</span> {{ selectedEl.donorName }}</div>
                      <div class="details-line" v-if="selectedEl.donorKey8"><span class="details-line-title">IČO:</span> {{ selectedEl.donorKey8 }}</div>
                      <div class="details-line" v-else><span class="details-line-title">IČO:</span> {{ selectedEl.donorIcoDoB }}</div>
                      <div class="details-line" v-if="selectedEl.orgType"><span class="details-line-title">Právní forma:</span> {{ selectedEl.orgType }}</div>
                      <div class="details-line" v-if="selectedEl.addressString"><span class="details-line-title">Adresa:</span> {{ selectedEl.addressString }}</div>
                      <div class="details-line" v-if="selectedEl.address && selectedEl.address.statNazev"><span class="details-line-title">Stát:</span> {{ selectedEl.address.statNazev }}</div>
                      <div class="details-line"><span class="details-line-title">Výše přímých darů:</span> {{ formatValue(selectedEl.donationsAmtDirect) }} Kč</div>
                    </div>
                    <div v-else>
                      <div class="details-line"><span class="details-line-title">Jméno:</span> {{ selectedEl.donorNameTitleCase }}</div>
                      <div class="details-line"><span class="details-line-title">Datum narození:</span> {{ selectedEl.birthdate2 }}</div>
                      <div class="details-line"><span class="details-line-title">Výše přímých darů:</span> {{ formatValue(selectedEl.donationsAmtDirect) }} Kč</div>
                      <div class="details-line"><span class="details-line-title">Výše nepřímých darů:</span> {{ formatValue(selectedEl.donationsAmtIndirect) }} Kč</div>
                    </div>
                  </div>
                  <!-- Donations -->
                  <div class="col-md-12" v-show="modalShowTable == 'b' && ((selectedEl.donations && selectedEl.donations.length > 0) || (selectedEl.indirectDonations && selectedEl.indirectDonations.length > 0))">
                    <div class="details-table-title">Přímé a nepřímé dary</div>
                    <table id="modalDonationsTable" class="modal-interactive-table">
                      <thead>
                        <tr><th>Datum</th><th>Typ</th><th>Dárce</th><th>Datum narození nebo IČO</th><th>Strana</th><th>Popis</th><th>Výše</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- Beneficial Owners -->
                  <div class="col-md-12" v-show="modalShowTable == 'c' && selectedEl.ownershipStructure && selectedEl.ownershipStructure.bo">
                    <div class="details-table-title">Přehled skutečných vlastníků v čase</div>
                    <table id="modalBoTable" class="modal-interactive-table">
                      <thead>
                        <tr><th>Jméno</th><th>Datum narození</th><th>Stát</th><th>Skutečným majitelem od</th><th>Skutečným majitelem do</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- Ownership structure -->
                  <div class="col-md-12" v-show="modalShowTable == 'd' && selectedEl.ownershipStructure && selectedEl.ownershipStructure.owners">
                    <div class="details-table-title">Přehled ovládajících osob v čase</div>
                    <table id="modalOwnershipTable" class="modal-interactive-table">
                      <thead>
                        <tr><th>Ovládaná společnost</th><th>Ovládající osoba</th><th>Stát</th><th>Ovládající osobou od</th><th>Ovládající osobou do</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- Entities -->
                  <div class="col-md-12" v-show="modalShowTable == 'e' && selectedEl.entities">
                    <div class="details-table-title">Ovládané právnické osoby</div>
                    <table id="modalEntitiesTable" class="modal-interactive-table">
                      <thead>
                        <tr><th>Název</th><th>IČO</th><th>Skutečným majitelem od</th><th>Skutečným majitelem do</th></tr>
                      </thead>
                    </table>
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

    <script src="static/donors.js?v=6"></script>

 
</body>
</html>