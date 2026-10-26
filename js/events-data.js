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
 * "featured": true dwingt dit item af in de aankondigingspopup op de
 * homepage, ongeacht datum-volgorde (bv. voor een belangrijke mededeling
 * zoals een vakantiesluiting die voorrang moet krijgen op een evenement
 * dat toevallig eerder plaatsvindt). Zie js/event-popup.js.
 */
window.EVENTS_DATA = [];
