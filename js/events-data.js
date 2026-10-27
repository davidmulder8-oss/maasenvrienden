/**
 * Maas en Vrienden - evenementen (NL / EN / DE)
 *
 * Vul deze lijst met echte, geplande evenementen. Elk item verschijnt
 * automatisch als kaart op evenementen.html (en in de aankondigingspopup
 * op de homepage), gesorteerd op datum.
 *
 * Velden: title, date (YYYY-MM-DD), time, category, description - elk als
 * {nl, en, de} - plus optioneel "image" (pad naar de poster/foto) en
 * "example" (true = toont een "Voorbeeld"-label, gebruik dit voor nog niet
 * bevestigde evenementen zodat er nooit per ongeluk iets verzonnens als
 * echt wordt gepubliceerd).
 *
 * "featured": true = dit evenement verschijnt als pop-up op de homepage.
 * "endDate" (optioneel, YYYY-MM-DD) = laatste dag; daarna verdwijnt het
 * evenement vanzelf van de site. Zonder endDate verdwijnt het na "date".
 * Beheer gaat het makkelijkst via de beheerpagina (maasenvrienden.online).
 */
window.EVENTS_DATA = [];
