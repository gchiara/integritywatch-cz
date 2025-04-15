<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>O webu | Integrity Watch Česká republika</title>
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/about.css">
</head>
<body>
    <?php include 'header.php' ?>

    <div id="app">    
      <div class="container">
        <div class="panel-group" id="accordion">
          <!-- BLOCK 1 -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">O webu</a>
              </h1>
            </div>
            <div id="collapse1" class="panel-collapse collapse show in">
              <div class="panel-body">
                <p>Integrity Watch Česká republika monitoruje financování českých politických stran a hnutí za účelem informování veřejnosti, posílení veřejné kontroly a detekce rizik ve financování politiky.</p> 
                <p>Na základě veřejných dat o financích jedenácti nejvlivnějších stran a hnutí od roku 2017 sekce „Strany“ popisuje obecné trendy ve financování politiky pomocí grafů s dynamickou funkcionalitou filtrování a třídění. Zároveň poskytuje detailní přehled všech darů a příspěvků těmto stranám v daném období.</p> 
                <p>Sekce „Dárci“ propojuje data o politických financích s otevřenými daty Veřejného rejstříku a Sbírky listin a odhaluje tak, kdo přesně za politickými dary stojí. Pomocí mapování majetkových vazeb dárců identifikuje rizikové dárcovství.</p>
                <p>Podrobnější informace o fungování platformy nalezete v <a href="IW ČR uživatelská příručka.pdf" target="_blank">uživatelské příručce</a>.</p>
                <p>Platforma Integrity Watch Česká republika vznikla v rámci projektu Integrity Watch 3.0 (číslo projektu: 101038764) za podpory Evropské komise ve spolupráci se Sekretariátem Transparency International a Transparency International EU. Jedná se o třetí iteraci projektu mezinárodní protikorupční sítě Transparency International, který využívá otevřená data k prosazování politické integrity pomocí monitoringu a detekce korupčních rizik.<br />
                Vývoj a vizuální podoba webu: <a href="http://www.chiaragirardelli.net">Chiara Girardelli</a><br /></p>
                <div class="about-eu-funding">
                  <img class="logo" src="./images/flag_yellow_low.jpg" />
                  <p style="font-family: Arial">Tato digitální platforma vznikla za finanční podpory Fondu pro vnitřní bezpečnost Evropské unie.</p>
                </div>
              </div>
            </div>
          </div>
          <!-- BLOCK 2 -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Data</a>
              </h1>
            </div>
            <div id="collapse2" class="panel-collapse collapse show in">
              <div class="panel-body">
                <p>Data o příjmech, výdajích a darech politických stran a hnutí pochází z jejich výročních finančních zpráv dostupných v digitalizované podobě na <a href="https://www.udhpsh.cz/vyrocni-financni-zpravy-stran-a-hnuti" target="_blank">stránkách Úřadu pro dohled nad hospodařením politických stran a politických hnutí (ÚDHPSH)</a>. Tato data poté propojujeme s daty o podnikatelích a skutečných vlastnících z <a href="https://dataor.justice.cz/" target="_blank">otevřených dat Ministerstva spravedlnosti</a>. Data o příspěvcích politickým stranám a hnutím ze státního rozpočtu České republiky stahujeme z <a href="https://mfcr.cz/" target="_blank">webu Ministerstva financí</a>.</p>
                <p>K aktualizaci dat dochází jednou ročně, kdy jsou výroční finanční zprávy všech sledovaných stran doručeny na ÚDHPSH a posléze zveřejněny na webových stránkách úřadu. </p>
                <p>Všechna data využívána touto platformou (i platformami Integrity Watch v jiných zemích) jsou dostupná ke stažení ve formátu JSON na <a href="https://data.integritywatch.eu/" target="_blank">Integrity Watch Data Hub</a>.</p>
              </div>
            </div>
          </div>
          <!-- CONTACTS -->
          <div class="panel panel-default panel-static">
            <div class="panel-heading">
              <h2 class="panel-title">
                <a href="#">Kontakt</a>
              </h2>
            </div>
            <div id="contact" class="panel-collapse">
              <div class="panel-body">
              <p>Neváhejte se na nás obrátit, pokud na platformě nalezete chybu nebo nesrovnalost, rádi Váš podnět prověříme.</p>
              <p>S dotazy se můžete obracet na adresu: <a href="mailto:posta@transparency.cz">posta@transparency.cz</a>.</p>
            </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <script src="static/about.js"></script>
</body>
</html>