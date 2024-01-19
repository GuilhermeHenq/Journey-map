const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const emotionController = require('../Controllers/emotionController');

app.get('/emotion', emotionController.getAllItems);
app.post('/emotion', emotionController.postItem);
app.put('/emotion', emotionController.updateItem);

const contactPointController = require('../Controllers/contactPointController');

app.get('/contactPoint', contactPointController.getAllItems);
app.post('/contactPoint', contactPointController.postItem);
app.put('/contactPoint', contactPointController.updateItem);

const journeyPhaseController = require('../Controllers/journeyPhaseController');

app.get('/journeyPhase', journeyPhaseController.getAllItems);
app.post('/journeyPhase', journeyPhaseController.postItem);
app.put('/journeyPhase', journeyPhaseController.updateItem);

const thoughtController = require('../Controllers/thoughtController');

app.get('/thought', thoughtController.getAllItems);
app.post('/thought', thoughtController.postItem);
app.put('/thought', thoughtController.updateItem);

const userActionController = require('../Controllers/userActionController');

app.get('/userAction', userActionController.getAllItems);
app.post('/userAction', userActionController.postItem);
app.put('/userAction', userActionController.updateItem);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
