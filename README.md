# wutZUGonaDo
Electron test app, the idea is to have a kind of sidebar to keep memos, simple checklists, eventually set up alarms or synchronize with a calendar.
The system should be totally modular and allow complete personalization of the display.

## Getting Started
Clone this repository locally
``` bash
git clone https://github.com/Nyckel/wutZUGonaDo.git
``` 

Install dependencies with npm :

``` bash
npm install
```

## To build for development
- **in a terminal window** -> npm start  

## To build for production
- Using development variables (environments/index.ts) :  `npm run electron:dev`
- Using production variables (environments/index.prod.ts) :  `npm run electron:prod`

Your built files are in the /dist folder.

## Included Commands

|Command|Description|
|--|--|
|`npm run start:web`| Execute the app in the brower |
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Ma |

