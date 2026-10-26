/**
 * Maas en Vrienden - menukaart data (NL / EN / DE)
 * Overgenomen uit de officiële menukaart (PDF). Prijzen in euro's.
 * Vul "nl", "en" en "de" in om de kaart in alle talen bij te werken.
 *
 * Dieetvelden ("diet"): vegan / glutenfree / lactosefree.
 * Deze staan bewust standaard op "false" - dit is NIET geraden, omdat een
 * verkeerd label bij een allergie/intolerantie een gast echt ziek kan
 * maken. Zet een veld pas op "true" zodra bevestigd is dat het gerecht
 * (incl. bereidingswijze, gedeelde frituur, sauzen enz.) daadwerkelijk aan
 * die eis voldoet. Zie README.md.
 *
 * Dagprijs: "dayDeal": { day, price } = speciale prijs op een vaste dag
 * (0 = zondag ... 6 = zaterdag, bv. Pizzadag op donderdag = 4, Satédag op
 * zaterdag = 6). Die prijs wordt alleen getoond als hij lager is dan de
 * normale prijs. "onlyDay": 4 = gerecht is alleen op die dag te bestellen.
 */
window.MENU_DATA = [
  {
    "id": "lunch",
    "name": {
      "nl": "Lunch",
      "en": "Lunch",
      "de": "Lunch"
    },
    "note": {
      "nl": "Van 12:00 tot 14:00 uur",
      "en": "From 12:00 to 14:00",
      "de": "Von 12:00 bis 14:00 Uhr"
    },
    "items": [
      {
        "name": {
          "nl": "Tosti Ham/Kaas",
          "en": "Ham & Cheese Toastie",
          "de": "Toast Schinken/Käse"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 6.75,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Tosti Vrienden",
          "en": "Toastie Vrienden",
          "de": "Toast Vrienden"
        },
        "description": {
          "nl": "Ham, kaas, tomaat, pesto",
          "en": "Ham, cheese, tomato, pesto",
          "de": "Schinken, Käse, Tomate, Pesto"
        },
        "price": 7.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Uitsmijter Ham/Kaas",
          "en": "Uitsmijter Ham & Cheese",
          "de": "Uitsmijter Schinken/Käse"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 9.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "2 Kroketten op brood",
          "en": "2 Croquettes on Bread",
          "de": "2 Kroketten auf Brot"
        },
        "description": {
          "nl": "Wit of bruin brood",
          "en": "White or brown bread",
          "de": "Weißes oder dunkles Brot"
        },
        "price": 8.25,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "12 Uurtje",
          "en": "12 Uurtje",
          "de": "12 Uurtje"
        },
        "description": {
          "nl": "Soep, brood met kroket, brood ham/kaas met een gebakken ei.",
          "en": "Soup, bread with croquette, bread with ham & cheese and a fried egg.",
          "de": "Suppe, Brot mit Kroket, Brot mit Schinken/Käse und einem Spiegelei."
        },
        "price": 14.95,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "voorgerechten",
    "name": {
      "nl": "Voorafjes",
      "en": "Starters",
      "de": "Vorspeisen"
    },
    "note": {
      "nl": "Vanaf 17:00 uur",
      "en": "From 5:00 PM",
      "de": "Ab 17:00 Uhr"
    },
    "items": [
      {
        "name": {
          "nl": "Brood met kruidenboter",
          "en": "Bread with herb butter",
          "de": "Brot mit Kräuterbutter"
        },
        "description": {
          "nl": "Wit en/of bruin brood",
          "en": "White and/or brown bread",
          "de": "Weißes und/oder dunkles Brot"
        },
        "price": 5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Brood met dipjes",
          "en": "Bread with dips",
          "de": "Brot mit Dips"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 6,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Huisgemaakte soep",
          "en": "Homemade soup",
          "de": "Hausgemachte Suppe"
        },
        "description": {
          "nl": "Huisgemaakte soep door de chef, met vers gebakken brood.",
          "en": "Homemade soup by the chef, served with freshly baked bread.",
          "de": "Hausgemachte Suppe des Küchenchefs, mit frisch gebackenem Brot."
        },
        "price": 6,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Rundercarpaccio",
          "en": "Beef carpaccio",
          "de": "Rindercarpaccio"
        },
        "description": {
          "nl": "Pijnboompitjes, kappertjes, rucola sla, zongedroogde tomaat, dressing en Parmezaanse kaas.",
          "en": "Pine nuts, capers, rocket, sun-dried tomato, dressing and Parmesan cheese.",
          "de": "Pinienkerne, Kapern, Rucola, getrocknete Tomaten, Dressing und Parmesan."
        },
        "price": 14.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Gamba's in look",
          "en": "Garlic gambas",
          "de": "Gambas in Knoblauch"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 15,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "pizzas",
    "name": {
      "nl": "Pizza's",
      "en": "Pizzas",
      "de": "Pizzen"
    },
    "note": {
      "nl": "Vanaf 17:00 uur · elke donderdag Pizzadag: alle pizza's € 12,50 (ook afhalen)",
      "en": "From 5:00 PM · every Thursday Pizza Day: all pizzas € 12.50 (takeaway too)",
      "de": "Ab 17:00 Uhr · jeden Donnerstag Pizzatag: alle Pizzen € 12,50 (auch zum Mitnehmen)"
    },
    "items": [
      {
        "name": {
          "nl": "Pizza Margherita",
          "en": "Pizza Margherita",
          "de": "Pizza Margherita"
        },
        "description": {
          "nl": "Tomatensaus, kaas, oregano.",
          "en": "Tomato sauce, cheese, oregano.",
          "de": "Tomatensauce, Käse, Oregano."
        },
        "price": 11,
        "diet": {
          "vegan": false,
          "vegetarian": true,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 4,
          "price": 12.5
        }
      },
      {
        "name": {
          "nl": "Pizza Hawaï",
          "en": "Pizza Hawaii",
          "de": "Pizza Hawaii"
        },
        "description": {
          "nl": "Tomatensaus, kaas, ham, ananas.",
          "en": "Tomato sauce, cheese, ham, pineapple.",
          "de": "Tomatensauce, Käse, Schinken, Ananas."
        },
        "price": 13,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 4,
          "price": 12.5
        }
      },
      {
        "name": {
          "nl": "Pizza Tonijn",
          "en": "Pizza Tuna",
          "de": "Pizza Thunfisch"
        },
        "description": {
          "nl": "Tomatensaus, kaas, tonijn, rode ui.",
          "en": "Tomato sauce, cheese, tuna, red onion.",
          "de": "Tomatensauce, Käse, Thunfisch, rote Zwiebel."
        },
        "price": 14,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 4,
          "price": 12.5
        }
      },
      {
        "name": {
          "nl": "Pizza Funghi",
          "en": "Pizza Funghi",
          "de": "Pizza Funghi"
        },
        "description": {
          "nl": "Tomatensaus, kaas, champignons.",
          "en": "Tomato sauce, cheese, mushrooms.",
          "de": "Tomatensauce, Käse, Champignons."
        },
        "price": 14,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 4,
          "price": 12.5
        }
      },
      {
        "name": {
          "nl": "Pizza Shoarma",
          "en": "Pizza Shoarma",
          "de": "Pizza Schoarma"
        },
        "description": {
          "nl": "Tomatensaus, kaas, shoarma, knoflooksaus.",
          "en": "Tomato sauce, cheese, shoarma, garlic sauce.",
          "de": "Tomatensauce, Käse, Schoarma, Knoblauchsauce."
        },
        "price": 16,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 4,
          "price": 12.5
        }
      },
      {
        "name": {
          "nl": "Pizza Döner",
          "en": "Pizza Döner",
          "de": "Pizza Döner"
        },
        "description": {
          "nl": "Tomatensaus, kaas, döner, knoflooksaus.",
          "en": "Tomato sauce, cheese, döner, garlic sauce.",
          "de": "Tomatensauce, Käse, Döner, Knoblauchsauce."
        },
        "price": 17.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 4,
          "price": 12.5
        }
      },
      {
        "name": {
          "nl": "Pizza Pepperoni",
          "en": "Pizza Pepperoni",
          "de": "Pizza Peperoni"
        },
        "description": {
          "nl": "Tomatensaus, kaas, pepperoni.",
          "en": "Tomato sauce, cheese, pepperoni.",
          "de": "Tomatensauce, Käse, Peperoni-Salami."
        },
        "price": 12.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "onlyDay": 4
      }
    ]
  },
  {
    "id": "hoofdgerechten",
    "name": {
      "nl": "Hoofdgerechten",
      "en": "Main courses",
      "de": "Hauptgerichte"
    },
    "note": {
      "nl": "Vanaf 17:00 uur · alle hoofdgerechten worden geserveerd met frietjes",
      "en": "From 5:00 PM · all main courses are served with fries",
      "de": "Ab 17:00 Uhr · alle Hauptgerichte werden mit Pommes serviert"
    },
    "items": [
      {
        "name": {
          "nl": "Huisgemaakte kipsaté",
          "en": "Homemade chicken satay",
          "de": "Hausgemachtes Hähnchen-Saté"
        },
        "description": {
          "nl": "Malse kipfilet aan spies, Indonesisch gemarineerd, satésaus en gebakken uitjes.",
          "en": "Tender chicken fillet skewer, Indonesian marinated, satay sauce and fried onions.",
          "de": "Zartes Hähnchenfilet am Spieß, indonesisch mariniert, Saté-Soße und gebratene Zwiebeln."
        },
        "price": 16,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        },
        "dayDeal": {
          "day": 6,
          "price": 14.5
        }
      },
      {
        "name": {
          "nl": "Fish en chips",
          "en": "Fish and chips",
          "de": "Fish and Chips"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 17.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Spareribs",
          "en": "Spare ribs",
          "de": "Spareribs"
        },
        "description": {
          "nl": "Bereid en gemarineerd door de chef, geserveerd met coleslaw.",
          "en": "Prepared and marinated by the chef, served with coleslaw.",
          "de": "Vom Küchenchef zubereitet und mariniert, serviert mit Krautsalat."
        },
        "price": 18.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Gamba's pil pil",
          "en": "Gambas pil pil",
          "de": "Gambas Pil Pil"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 20.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Biefstuk met pepersaus",
          "en": "Steak with pepper sauce",
          "de": "Steak mit Pfeffersauce"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 24,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "classics",
    "name": {
      "nl": "Classics",
      "en": "Classics",
      "de": "Klassiker"
    },
    "note": {
      "nl": "Vanaf 17:00 uur · geserveerd met frietjes · vraag ook naar ons weekmenu",
      "en": "From 5:00 PM · served with fries · ask about our weekly menu",
      "de": "Ab 17:00 Uhr · mit Pommes serviert · fragen Sie auch nach unserem Wochenmenü"
    },
    "items": [
      {
        "name": {
          "nl": "Schnitzel met champignonsaus",
          "en": "Schnitzel with mushroom sauce",
          "de": "Schnitzel mit Champignonsauce"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 16.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Runderhamburger",
          "en": "Beef burger",
          "de": "Rindfleischburger"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 17.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "fries",
    "name": {
      "nl": "Fries",
      "en": "Fries",
      "de": "Fries"
    },
    "note": {
      "nl": "Vanaf 17:00 uur",
      "en": "From 5:00 PM",
      "de": "Ab 17:00 Uhr"
    },
    "items": [
      {
        "name": {
          "nl": "Loaded truffel",
          "en": "Loaded truffle",
          "de": "Loaded Trüffel"
        },
        "description": {
          "nl": "Pulled chicken in huisgemaakte marinade, gebakken uitjes, ingelegde komkommer, wortel, bosui, geraspte kaas en truffelmayo.",
          "en": "Pulled chicken in homemade marinade, fried onions, pickled cucumber, carrot, spring onion, grated cheese and truffle mayo.",
          "de": "Pulled Chicken in hausgemachter Marinade, gebratene Zwiebeln, eingelegte Gurke, Karotte, Frühlingszwiebel, geriebener Käse und Trüffelmayo."
        },
        "price": 15,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Loaded chili",
          "en": "Loaded chili",
          "de": "Loaded Chili"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 15.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Loaded beef",
          "en": "Loaded beef",
          "de": "Loaded Beef"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 16,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Shoarma schotel",
          "en": "Shoarma platter",
          "de": "Schoarma-Teller"
        },
        "description": {
          "nl": "Extra shoarma + € 3,50",
          "en": "Extra shoarma + € 3.50",
          "de": "Extra Schoarma + € 3,50"
        },
        "price": 16,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Döner schotel",
          "en": "Döner platter",
          "de": "Döner-Teller"
        },
        "description": {
          "nl": "Extra döner + € 3,50",
          "en": "Extra döner + € 3.50",
          "de": "Extra Döner + € 3,50"
        },
        "price": 17,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "bijgerechten",
    "name": {
      "nl": "Bijgerechten",
      "en": "Side dishes",
      "de": "Beilagen"
    },
    "note": {
      "nl": "Vanaf 17:00 uur",
      "en": "From 5:00 PM",
      "de": "Ab 17:00 Uhr"
    },
    "items": [
      {
        "name": {
          "nl": "Huisgemaakte champignonsaus",
          "en": "Homemade mushroom sauce",
          "de": "Hausgemachte Champignonsauce"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 3,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Huisgemaakte pepersaus",
          "en": "Homemade pepper sauce",
          "de": "Hausgemachte Pfeffersauce"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 3,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Gemengde salade",
          "en": "Mixed salad",
          "de": "Gemischter Salat"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 4,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Friet met mayonaise",
          "en": "Fries with mayonnaise",
          "de": "Pommes mit Mayonnaise"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 4.5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "borrelplank",
    "name": {
      "nl": "Borrelplank",
      "en": "Bar Snacks Platter",
      "de": "Snackplatte"
    },
    "note": {
      "nl": "Vanaf 17:00 uur",
      "en": "From 5:00 PM",
      "de": "Ab 17:00 Uhr"
    },
    "items": [
      {
        "name": {
          "nl": "Frikandelletjes 8x",
          "en": "Mini Frikandel 8x",
          "de": "Mini-Frikandeln 8x"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 6,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Bitterballen 8x",
          "en": "Bitterballen 8x",
          "de": "Bitterballen 8x"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 8.25,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Kipnuggets 8x",
          "en": "Chicken Nuggets 8x",
          "de": "Chicken Nuggets 8x"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 8.25,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Mix Hapjes 8x",
          "en": "Mixed Snacks 8x",
          "de": "Snack-Mix 8x"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 6.25,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Mix Hapjes 16x",
          "en": "Mixed Snacks 16x",
          "de": "Snack-Mix 16x"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 9.75,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "kindermenu",
    "name": {
      "nl": "Kindermenu",
      "en": "Children's Menu",
      "de": "Kindermenü"
    },
    "note": {
      "nl": "Vanaf 17:00 uur",
      "en": "From 5:00 PM",
      "de": "Ab 17:00 Uhr"
    },
    "items": [
      {
        "name": {
          "nl": "Kidsbox",
          "en": "Kids Box",
          "de": "Kids-Box"
        },
        "description": {
          "nl": "Snack, speeltje en een bon voor een ijsje.",
          "en": "Snack, toy and a voucher for an ice cream.",
          "de": "Snack, Spielzeug und ein Gutschein für ein Eis."
        },
        "price": 7,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Kinderfriet",
          "en": "Kids' Fries",
          "de": "Kinderpommes"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 3,
        "diet": {
          "vegan": true,
          "vegetarian": true,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Kinderfriet met frikandel",
          "en": "Kids' Fries with Frikandel",
          "de": "Kinderpommes mit Frikandel"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Kinderfriet met bitterballen",
          "en": "Kids' Fries with Bitterballen",
          "de": "Kinderpommes mit Bitterballen"
        },
        "description": {
          "nl": "4 stuks",
          "en": "4 pieces",
          "de": "4 Stück"
        },
        "price": 5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Kinderfriet met kipnuggets",
          "en": "Kids' Fries with Chicken Nuggets",
          "de": "Kinderpommes mit Chicken Nuggets"
        },
        "description": {
          "nl": "4 stuks",
          "en": "4 pieces",
          "de": "4 Stück"
        },
        "price": 6,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  },
  {
    "id": "desserts",
    "name": {
      "nl": "Gebak & Desserts",
      "en": "Cakes & Desserts",
      "de": "Kuchen & Desserts"
    },
    "note": {
      "nl": "",
      "en": "",
      "de": ""
    },
    "items": [
      {
        "name": {
          "nl": "Sorbet",
          "en": "Sorbet",
          "de": "Sorbet"
        },
        "description": {
          "nl": "2 bolletjes vanille-ijs met heerlijke vruchtjes, aardbeiensaus en een toefje slagroom.",
          "en": "Two scoops of vanilla ice cream with delicious fruit, strawberry sauce and whipped cream.",
          "de": "Zwei Kugeln Vanilleeis mit leckeren Früchten, Erdbeersoße und Schlagsahne."
        },
        "price": 5.95,
        "diet": {
          "vegan": false,
          "vegetarian": true,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Dame Blanche",
          "en": "Dame Blanche",
          "de": "Dame Blanche"
        },
        "description": {
          "nl": "2 bolletjes vanille-ijs, chocolade-, karamel- of aardbeiensaus met een toefje slagroom.",
          "en": "Two scoops of vanilla ice cream with chocolate, caramel or strawberry sauce and whipped cream.",
          "de": "Zwei Kugeln Vanilleeis mit Schokoladen-, Karamell- oder Erdbeersoße und Schlagsahne."
        },
        "price": 7.95,
        "diet": {
          "vegan": false,
          "vegetarian": true,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Dessert van het huis",
          "en": "House dessert",
          "de": "Dessert des Hauses"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 9,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Appeltaart",
          "en": "Apple Pie",
          "de": "Apfelkuchen"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 4.75,
        "diet": {
          "vegan": true,
          "vegetarian": true,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Appeltaart met slagroom",
          "en": "Apple Pie with Whipped Cream",
          "de": "Apfelkuchen mit Schlagsahne"
        },
        "description": {
          "nl": "",
          "en": "",
          "de": ""
        },
        "price": 5,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      },
      {
        "name": {
          "nl": "Kinderijsje",
          "en": "Kids' Ice Cream",
          "de": "Kindereis"
        },
        "description": {
          "nl": "1 bolletje vanille-ijs, slagroom en sprinkels.",
          "en": "One scoop of vanilla ice cream, whipped cream and sprinkles.",
          "de": "Eine Kugel Vanilleeis, Schlagsahne und Streusel."
        },
        "price": 4.25,
        "diet": {
          "vegan": false,
          "vegetarian": false,
          "glutenfree": false,
          "lactosefree": false
        }
      }
    ]
  }
];
