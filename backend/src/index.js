const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const http = require ('http');

const routes = require ('./routes')
const { setupWebsocket } = require ('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://denny-developer:sigilosa@cluster-dev-hg4hb.mongodb.net/omnistack?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

//Métodos HTTP: GET, POST, PUT, DELETE

//Tipos de parâmetros:

// Query Params: resquest.req.query (filtros, ordenação, paginação)
// Route Params: resquest.req.params (identificar um recurso na alteração ou delete) 
// Body:

server.listen(3333);
