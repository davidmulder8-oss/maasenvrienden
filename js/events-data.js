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
window.EVENTS_DATA = [
  {
    "id": "weekspecial-hutspot-2026-11",
    "title": {
      "nl": "Weekspecial: Hutspot met gebakken spekjes",
      "en": "Special of the week: Dutch hutspot with crispy bacon",
      "de": "Wochenspecial: Hutspot mit knusprigem Speck"
    },
    "date": "2026-11-12",
    "endDate": "2026-11-15",
    "time": {
      "nl": "Donderdag t/m zondag, € 10,95",
      "en": "Thursday to Sunday, € 10.95",
      "de": "Donnerstag bis Sonntag, 10,95 €"
    },
    "category": {
      "nl": "Weekspecial",
      "en": "Special of the week",
      "de": "Wochenspecial"
    },
    "description": {
      "nl": "Buiten koud? Bij Maas & Vrienden zit je er warmpjes bij! De winter vraagt om gezelligheid, warmte en natuurlijk een heerlijk bordje ouderwetse Hollandse kost. Deze week zetten we onze heerlijke Hutspot met krokant gebakken spekjes in de spotlight. Vers bereid, lekker smeuïg en geserveerd met een kommetje warme jus. En het mooiste? Je geniet al van deze winterse verwennerij voor slechts € 10,95! Even opwarmen, lekker eten en genieten van de gezelligheid. Schuif gezellig aan bij Eetcafé Maas & Vrienden, waar warmte en gezelligheid samenkomen.",
      "en": "Cold outside? At Maas & Vrienden you'll be nice and warm! Winter calls for cosiness, warmth and of course a lovely plate of traditional Dutch food. This week we put our delicious hutspot (mashed potatoes, carrots and onion) with crispy fried bacon in the spotlight. Freshly made, smooth and creamy, and served with a little bowl of warm gravy. And the best part? You can enjoy this winter treat for just € 10.95! Warm up, eat well and enjoy the cosy atmosphere. Come and join us at Eetcafé Maas & Vrienden, where warmth and cosiness come together.",
      "de": "Draußen kalt? Bei Maas & Vrienden sitzen Sie schön warm! Der Winter verlangt nach Gemütlichkeit, Wärme und natürlich einem leckeren Teller traditioneller holländischer Küche. Diese Woche stellen wir unseren köstlichen Hutspot (Kartoffelstampf mit Möhren und Zwiebeln) mit knusprig gebratenem Speck ins Rampenlicht. Frisch zubereitet, schön cremig und serviert mit einem Schälchen warmer Bratensoße. Und das Beste? Diesen winterlichen Genuss gibt es schon für nur 10,95 €! Aufwärmen, gut essen und die Gemütlichkeit genießen. Setzen Sie sich zu uns ins Eetcafé Maas & Vrienden, wo Wärme und Gemütlichkeit zusammenkommen."
    },
    "image": "images/weekspecial-hutspot.webp",
    "featured": true
  }
];
