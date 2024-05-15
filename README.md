<b><h1>EasyJourneyMap</h1></b>

Front-end made with React Native + Vite, utilizing the React Konva library, a popular shape-manipulation tool, as its main structural point for the tool build. Back-end made with Node.JS using Express framework, a very popular web structured framework, coded in JavaScript that runs over the Node.JS environment in execution time. Utilizing a MySQL database, with schema <i>mapjourney</i> to store all info.

<b><h2>How to start front-end interface:</h2></b>

- cd .\frontend\
- npm i
- npm run dev

React should start running on port 5173.

<b><h2>How to start Node.JS server:</h2></b>

- cd .\backend\
- npm i
- npm run dev

Server should start running on port 3000.

<b><h2>Configure your database MySql</h2></b>

- cd .\backend\
- create .env
- DB_HOST= your host (localhost probably)
- DB_USER= your user
- DB_PASSWORD= your pass
- DB_DATABASE= your databasename (mapjourney probably)


<b><h2>How to create <i>mapjourney</i> table in MySQL:</h2></b>

- Import the mapjourneyDB.sql file to configure and create your database
