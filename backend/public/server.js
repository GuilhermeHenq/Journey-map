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
app.delete('/emotion/:emotionId', emotionController.deleteItem);
app.delete('/emotion', emotionController.deleteItemsByJourneyMapId);

const contactPointController = require('../Controllers/contactPointController');

app.get('/contactPoint', contactPointController.getAllItems);
app.post('/contactPoint', contactPointController.postItem);
app.put('/contactPoint', contactPointController.updateItem);
app.delete('/contactPoint/:contactPointId', contactPointController.deleteItem);
app.delete('/contactPoint', contactPointController.deleteItemsByJourneyMapId);

const journeyPhaseController = require('../Controllers/journeyPhaseController');

app.get('/journeyPhase', journeyPhaseController.getAllItems);
app.post('/journeyPhase', journeyPhaseController.postItem);
app.put('/journeyPhase', journeyPhaseController.updateItem);
app.delete('/journeyPhase/:journeyPhaseId', journeyPhaseController.deleteItem);
app.delete('/journeyPhase', journeyPhaseController.deleteItemsByJourneyMapId);

const thoughtController = require('../Controllers/thoughtController');

app.get('/thought', thoughtController.getAllItems);
app.post('/thought', thoughtController.postItem);
app.put('/thought', thoughtController.updateItem);
app.delete('/thought/:thoughtId', thoughtController.deleteItem);
app.delete('/thought', thoughtController.deleteItemsByJourneyMapId);

const userActionController = require('../Controllers/userActionController');

app.get('/userAction', userActionController.getAllItems);
app.post('/userAction', userActionController.postItem);
app.put('/userAction', userActionController.updateItem);
app.delete('/userAction/:userActionId', userActionController.deleteItem);
app.delete('/userAction', userActionController.deleteItemsByJourneyMapId);

const journeyMapController = require('../Controllers/journeyMapController');

app.get('/journeyMap', journeyMapController.getUserMaps);
app.post('/journeyMap', journeyMapController.createMap);
app.delete('/journeyMap/:journeyMapId', journeyMapController.deleteUserMaps);
app.put('/journeyMap', journeyMapController.updateMapName);



app.listen(port, () => {
  console.log(`---------------------------------------------`);
  console.log(`  Server listening at http://localhost:${port}`);
  console.log(`---------------------------------------------`);
});
