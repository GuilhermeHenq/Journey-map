<b><h1>EasyJourneyMap</h1></b>

Front-end made with React Native + Vite, utilizing the React Konva library, a popular shape-manipulation tool, as its main structural point for the tool build. Back-end made with Node.JS using Express framework, a very popular web structured framework, coded in JavaScript that runs over the Node.JS environment in execution time. Utilizing a MySQL database, with schema <i>mapjourney</i> to store all info.

<b><h2>How to start front-end interface:</h2></b>

- cd .\frontend\
- npm i (only on first install)
- npm run dev

React should start running on port 5173.

<b><h2>How to start Node.JS server:</h2></b>

- cd .\backend\
- npm i (only on first install)
- cd .\public\
- node server.js

Server should start running on port 8080.

<b><h2>How to create <i>mapjourney</i> table in MySQL:</h2></b>

- CREATE DATABASE mapjoruney;
- USE DATABASE mapjourney;
- Run commands in "tabelas_relacionadas_a_map.txt" and "tabelas_relacionadas_a_journeyMap.txt"

Schema should be up and running perfectly.
