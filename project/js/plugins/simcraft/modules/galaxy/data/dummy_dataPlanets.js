const $dataPlanets = [
    {   "id":0, "name":"Ankaros Star",
        "type":"star",
        "x":640, "y":310, "zoom":1,
        "bitmapName":"Suros",
        "moves":[
            {"type":"scale", "value":0.2, "speed":0.002},
            {"type":"rotation", "value":0.0003},
            {"type":"opacity", "speed":0.005, "min":100, "max":160}
        ]
    },
    {   "id":1, "name":"Vortex Warp",
        "type":"Warp",
        "x":1165, "y":132, "zoom":0.1,
        "bitmapName":"planet_1",
        "moves":[
            {"type":"scale", "value":0.2, "speed":0.002},
            {"type":"rotation", "value":0.03},
            {"type":"opacity", "speed":0.5, "min":100, "max":160}
        ]
    },
    {   "id":2, "name":"Vortex Warp",
        "type":"Warp",
        "x":1165, "y":132, "zoom":0.15,
        "bitmapName":"planet_6",
        "moves":[
            {"type":"scale", "value":0.2, "speed":0.003},
            {"type":"rotation", "value":0.04},
            {"type":"opacity", "speed":0.5, "min":100, "max":200}
        ]
    },
    {   "id":3, "name":"Furia",
        "type":"Volcanic World",
        "x":1165, "y":132, "zoom":0.1,
        "bitmapName":"planet_2",
        "moves":[
            {"type":"scaleOnY", "value":0.11},
            {"type":"rotation", "value":0.001},
            {"type":"orbit", "value":0.5, "speed":0.00015, "centerX":640, "centerY":320, "radiusX":330, "radiusY":160}
        ]
    },
    {   "id":4, "name":"Ankaros Prime",
        "type":"Hive World",
        "x":350, "y":240, "zoom":0.2,
        "bitmapName":"planet_0",
        "moves":[
            {"type":"scaleOnY", "value":0.24},
            {"type":"rotation", "value":0.001},
            {"type":"orbit", "value":0.5, "speed":0.0001, "centerX":640, "centerY":320, "radiusX":440, "radiusY":240}
        ]
    },
    {   "id":5, "name":"Wanghek",
        "type":"Hostile Jungle World",
        "x":350, "y":240, "zoom":0.12,
        "bitmapName":"planet_3",
        "moves":[
            {"type":"scaleOnY", "value":0.135},
            {"type":"rotation", "value":0.002},
            {"type":"orbit", "value":0.5, "speed":0.00006, "centerX":640, "centerY":320, "radiusX":550, "radiusY":300}
        ]
    },
    {   "id":6, "name":"Ankaros Secondus",
        "type":"Agri-World",
        "description":"Ankaros secondus is the primary center of production to Food Supplies",
        "x":350, "y":240, "zoom":0.12,
        "bitmapName":"planet_3",
        "moves":[
            {"type":"scaleOnY", "value":0.135},
            {"type":"rotation", "value":0.002},
            {"type":"orbitPlanet", "value":0.5, "speed":0.00006, "planetId":4, "radiusX":550, "radiusY":300}
        ]
    },
    {   "id":7, "name":"Alth Efkath",
        "type":"Forge-World",
        "description":"",
        "x":350, "y":240, "zoom":0.12,
        "bitmapName":"planet_3",
        "moves":[
            {"type":"scaleOnY", "value":0.135},
            {"type":"rotation", "value":0.002},
            {"type":"orbitPlanet", "value":0.5, "speed":0.00006, "planetId":4, "radiusX":550, "radiusY":300}
        ]
    },
    {   "id":8, "name":"Station Altus",
        "type":"Orbital Station",
        "description":"",
        "x":350, "y":240, "zoom":0.03,
        "bitmapName":"ship_1",
        "moves":[
            {"type":"orbitPlanet", "value":0.5, "speed":0.0026, "planetId":4, "radiusX":48, "radiusY":48}
        ]
    }
];