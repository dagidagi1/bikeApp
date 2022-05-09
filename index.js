import express from 'express';
import path from 'path';
import {requestTime, logger} from './src/js/middlewares.js';

// import serverRoutes from './servers.js'
const __dirname = path.resolve();
const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(express.static(path.resolve(__dirname, './')));
app.use(express.static(path.resolve(__dirname, './src/html')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(requestTime);
app.use(logger);

// app.use(serverRoutes)
app.set('view engine', 'jade');
app.get('/', (req, res) => {
  console.log(req);
  res.sendFile(__dirname + '/src/html' + req.url);
  // res.render("index", { title: "Main Page", active: "main" });
});

app.get('/features', (req, res) => {
  res.render('features', {title: 'Features Page', active: 'features'});
});

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}...`);
});
