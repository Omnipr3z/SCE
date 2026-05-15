const $dataQuests =[
    {   "id":0, "name":"Imperial Signal",
        "alertTxt": [
            {"style":"nul", "txt":"Astropathic Signal detected. Entering Communication..."},
            {"style":"nul", "txt":"Assermented autorisation Artis-4568.Transcription loading..."},
            {"style":"alert", "txt":"I'm the Administrator Gouvernor of the Ankaros Sector from the planet Ankaros Prime."},
            {"style":"alert", "txt":"We need Help. Please take th.."},
            {"style":"null", "txt":"Unexepted communication ending..."},
            {"style":"imperium", "txt":"..."}

        ],
        "description":"Une emission mystérieuse provenant de la planète Ankaros Prime",
        "iconName":"mapIcon_imp",
        "pos":{
            "type":"follow",
           "planetId": "3"
        },
        "active":false
    },
    {   "id":1, "name":"Imperial Signal",
        "description":"Une emission mystérieuse provenant de la planète Ankaros Prime",
        "iconName":"mapIcon_qust",
        "pos":{
            "type":"static",
           "x": "800",
           "y": "300"
        },
        "active":false
    }
]