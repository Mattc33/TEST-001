module.exports = {
  "pages": [
    {
      "title": "Home Page",
      "name": "Home.aspx",
      "welcomePage": true,
      "templateUrl": "/_catalogs/masterpage/_vp-portal/slalomdemo--homepage.aspx",
      "webparts": [
        {
          "type": "report rotator",
          "zone": "xed394ab45e87432bb7b30612e9b5538c",
          "chrome": "TitleOnly",
          "properties": {
            "id": "bb774cc0-cd22-4af8-949c-59a6ba6eeeae",
            "instanceId": "abd4adba-7b61-45d5-abe8-baad6293ffa4",
            "title": "Artist Team View",
            "description": "Displays the SWAT team defined in the artist site.",
            "dataVersion": "1.0",
            "properties": {
              "description": "Artist Team (DEV)"
            }
          }
        },
        {
          "type": "report my fav",
          "zone": "xed394ab45e87432bb7b30612e9b5548c",
          "properties": {
            "id": "ad10fa58-8207-4d1c-a847-7ea8e0233918",
            "instanceId": "689dfffb-60ec-4c00-b41e-cd1f56c8933c",
            "title": "Artist Calendar",
            "description": "Artist Calendar",
            "dataVersion": "1.0",
            "properties": {
              "artistTermSetName": "DEV WMG Artists",
              "artistTermSetId": "28f0b46e-5831-4e6b-8ef2-293b15d0c3e2",
              "categoryTermSetName": "DEV WMG Event Categories",
              "categoryTermSetId": "08b3caf2-43c4-4f0e-a05f-ee148bbbed20",
              "defaultArtistTermId": "",
              "embedded": true
            }
          }
        }
      ]
    }
  ]
}