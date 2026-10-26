# Maas en Vrienden - website

Volledig statische website (HTML/CSS/JavaScript, geen build-tools nodig) voor eetcafé Maas en Vrienden in Andel.

## Projectstructuur

```
index.html               Homepage
reserveren.html           Reserveringsformulier
menu.html                 Menukaart (filter + zoekfunctie)
over-ons.html              Verhaal, tijdlijn, sfeer
evenementen.html           Evenementen (uitbreidbaar)
camping.html                Camping De Hoge Waard
privacybeleid.html          Concept privacybeleid
algemene-voorwaarden.html   Concept algemene voorwaarden

css/
  style.css        Design system: kleuren, typografie, animaties, utilities
  components.css   Herbruikbare componenten: header, footer, kaarten, formulieren
  pages.css        Pagina-specifieke layout: hero, page-banner, secties

js/
  i18n.js          Vertaalsysteem NL/EN/DE - woordenboek + vertaal-engine
  main.js          Scroll-animaties, taalwisselaar-gedrag, foto-fallback
  hours.js         Eén centrale bron voor openingstijden (overal op de site)
  reservation.js   Validatie + verzending reserveringsformulier (Web3Forms)
  menu-data.js     Alle gerechten/prijzen in 3 talen (bron: menukaart PDF)
  menu.js          Rendering + filter + zoekfunctie menukaart
  events-data.js   Evenementen in 3 talen (uitbreidbaar, zie hieronder)
  events.js        Rendering + filter evenementen

images/            Logo, favicons en foto's (zie "Foto's toevoegen" hieronder)
assets/            Downloadbare menukaart (PDF)
```

`_devserver.ps1` is alleen een hulpscriptje waarmee tijdens de bouw lokaal getest is
(`powershell -File _devserver.ps1` start een server op `http://localhost:8181`).
Dit bestand is niet nodig op de uiteindelijke hosting en mag verwijderd worden.

---

## 1. Reserveringsformulier activeren (FormSubmit - één klik, geen account)

Het formulier stuurt reserveringen naar **info@maasenvrienden.nl** via
[FormSubmit.co](https://formsubmit.co). Hiervoor is bewust géén account-
gebaseerde dienst (zoals Web3Forms) gebruikt - er hoeft dus nergens een account
aangemaakt of een API-key ingevuld te worden.

**Enige stap die nog moet gebeuren:** zodra de allereerste reservering via de
website binnenkomt, stuurt FormSubmit automatisch een activatiemail naar
**info@maasenvrienden.nl** met een bevestigingslink. Iemand met toegang tot
die inbox moet die link één keer aanklikken - daarna werken alle volgende
reserveringen direct en automatisch, zonder verdere actie.

Tip: dien voor de livegang zelf een testreservering in via de website, zodat
die activatiemail meteen binnenkomt en bevestigd kan worden vóórdat gasten het
formulier gebruiken.

**Automatische bevestigingsmail aan de klant**: FormSubmit stuurt automatisch
een bevestiging naar het e-mailadres dat de gast invult (via het `_autoresponse`
veld in [js/reservation.js](js/reservation.js) - pas de tekst daar aan indien
gewenst).

**Getest**: alle validatie (verplichte velden, geen data uit het verleden,
tijden tussen 11:00–22:00 in kwartierblokken, sluitingsdagen, max. 20 personen)
werkt volledig los van deze koppeling.

### Datumkeuze

De datum kiest de gast uit een eenvoudige lijst (zoals bij het tijdstip) in
plaats van een kalender met maand/jaar-navigatie - makkelijker voor iedereen.
De lijst toont automatisch de eerstvolgende 60 dagen, met "Vandaag" en "Morgen"
gemarkeerd, en slaat gesloten dagen (nu: maandag en dinsdag) automatisch over.
Pas `DAYS_AHEAD` in `js/reservation.js` aan om deze periode te wijzigen.

---

## 2. Foto's toevoegen

Er waren geen bruikbare restaurantfoto's beschikbaar in de projectmap (de
meegeleverde afbeeldingen bleken lege placeholder-schermafbeeldingen van een
websitebouwer). De site toont daarom overal een nette, huisstijl-kleurige
placeholder ("foto volgt") totdat je een foto met de juiste bestandsnaam in
`images/` plaatst - zodra dat bestand bestaat, verschijnt de foto automatisch,
zonder dat er iets in de code aangepast hoeft te worden.

| Bestandsnaam (in `images/`) | Gebruikt op | Aanbevolen formaat |
|---|---|---|
| `hero-interieur.jpg` | Home - hero-achtergrond | breed, ≥ 1920×1080 |
| `andel-sfeer.jpg` | Home - over Andel | staand, 4:5 |
| `terras-1.jpg` t/m `terras-4.jpg` | Home - terrasgalerij | zie grid, div. formaten |
| `gerecht-kipsate.jpg` | Home - suggesties | ✅ aanwezig |
| `gerecht-truffel-fries.jpg` | Home - suggesties | 4:3, nog nodig |
| `gerecht-spareribs.jpg` | Home - suggesties | ✅ aanwezig |
| `over-ons-team.jpg` | Over ons | staand, 4:5 |
| `de-maas.jpg` | Over ons | staand, 4:5 |
| `sfeer-1.jpg` t/m `sfeer-5.jpg` | Over ons - sfeer-galerij | zie grid |
| `camping-hoge-waard.jpg` | Camping | staand, 4:5 |
| `camping-terras.jpg` | Camping | staand, 4:5 |
| `camping-galerij-1.jpg` t/m `camping-galerij-4.jpg` | Camping - galerij | zie grid |
| `event-<categorie-slug>.jpg` | Evenementen | 16:10 - bv. `event-live-muziek.jpg`, `event-bbq-avond.jpg` (slug = categorienaam in kleine letters, spaties → `-`) |

Tip: comprimeer foto's (bv. via [squoosh.app](https://squoosh.app)) voor snelle
laadtijden - de site is verder al volledig geoptimaliseerd voor performance.

---

## 3. Menukaart aanpassen

Alle gerechten staan overzichtelijk in [js/menu-data.js](js/menu-data.js) -
elk gerecht heeft een naam en omschrijving in drie talen (`nl`, `en`, `de`).
Pas de tekst of prijs aan, of voeg een nieuwe categorie/gerecht toe (vul alle
drie de talen in). De pagina (filters, zoekfunctie, weergave, vertaling)
werkt automatisch met elke wijziging. Vergeet niet ook de PDF in `assets/`
te vervangen als de menukaart wijzigt.

### Dieetfilters (vegan / glutenvrij / lactosevrij)

Op de menupagina staan drie filterknoppen naast de zoekbalk. Elk gerecht in
`js/menu-data.js` heeft een `diet`-veld:

```js
diet: { vegan: false, glutenfree: false, lactosefree: false }
```

**Dit staat bewust overal nog op `false`** - ik heb dit niet zelf ingeschat,
omdat een verkeerd label bij een allergie of intolerantie een gast écht
ziek kan maken (denk aan gedeelde frituurolie, verborgen boter/room in een
saus, bloem in kruidenmix, enz.). Zet per gerecht de juiste waarde(n) op
`true` zodra jij (of de kok) dit heeft geverifieerd - de badges op de kaart
en de filterknoppen werken dan direct, zonder verdere aanpassingen.

Zodra `diet.vegan: true` staat, verschijnt automatisch een klein rond
blaadjes-logootje direct achter de naam van dat gerecht (naast de gewone
Glutenvrij/Lactosevrij-badge onder de omschrijving). Ook dit is dus puur
weergave - er wordt niets automatisch als vegan aangemerkt.

---

## 4. Evenementen toevoegen

Voeg nieuwe evenementen toe in [js/events-data.js](js/events-data.js) - ook
hier weer met titel, omschrijving, tijd en categorie in drie talen. Zolang
een item `example: true` heeft, wordt het getoond met een duidelijk
"Voorbeeld"-label - dit voorkomt dat er per ongeluk een verzonnen evenement
als echt wordt gepubliceerd. Verwijder die regel zodra het evenement definitief
is. Is de lijst leeg, dan toont de pagina automatisch een nette "binnenkort
meer evenementen"-melding.

---

## 5. Openingstijden aanpassen

Alle openingstijden (statusindicator "Vandaag geopend/gesloten", openingstijden-
overzicht op de homepage, footer op elke pagina) komen uit **één bron**:
[js/hours.js](js/hours.js). Pas de tijden daar op één plek aan - een
sluitingstijd van `"00:00"` betekent middernacht en wordt overal correct
verwerkt (ook in het reserveringsformulier).

---

## 6. Meertaligheid (NL/EN/DE) aanpassen of uitbreiden

De hele site is vertaald naar Nederlands, Engels en Duits via
[js/i18n.js](js/i18n.js). Elke pagina bevat elementen met een
`data-i18n="sleutel"`-attribuut; de bijbehorende tekst per taal staat in het
woordenboek bovenin `js/i18n.js`. Om een tekst aan te passen, zoek je de
sleutel (bv. `home.intro.title`) en wijzig je de waarde voor `nl`, `en` en
`de`. De gekozen taal wordt onthouden via `localStorage` en geldt op alle
pagina's. Menukaart en evenementen hebben hun eigen vertalingen direct in
`menu-data.js` / `events-data.js` (zie hierboven).

Wil je een vierde taal toevoegen? Voeg de taalcode toe aan `SUPPORTED` in
`js/i18n.js`, vul een nieuw `DICT.<taal>`-blok met dezelfde sleutels, voeg een
vlag/label toe aan `updateLangSwitcherUI()`, en voeg een `<button class="lang-option" data-lang="...">`
toe aan de taalwisselaar op elke pagina.

---

## 7. Social media activeren

Zodra de Instagram/Facebook-links bekend zijn, kunnen social iconen worden
toegevoegd aan de footer (`footer-social`-component staat al klaar in
`css/components.css`). Er stonden nog geen accountlinks in de aangeleverde
gegevens.

---

## 8. Juridische pagina's

`privacybeleid.html` en `algemene-voorwaarden.html` zijn goedgekeurd en
definitief. KVK-nummer (98200208) is verwerkt.

---

## 9. Hosting / deployment

Dit is een 100% statische site - er is geen server, database of build-stap
nodig. Upload de hele projectmap naar elke statische hosting, bijvoorbeeld:

- **Netlify / Vercel**: sleep de map in het dashboard, of koppel een Git-repo.
- **GitHub Pages**: push naar een repository en activeer Pages.
- **Gewone (shared) hosting**: upload alle bestanden via FTP naar de
  `public_html`-map.

Vergeet niet na livegang de canonical-URL's, `sitemap.xml` en
`robots.txt` te controleren als het domein afwijkt van
`https://www.maasenvrienden.nl/`.
