var gitlab = require('./lib/gitlab'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
}).post('/opened', (req, res) => {
    gitlab.listOpenedIssues(req.body.created_after,req.body.created_before).then(e => res.send(e)).catch(e => res.status(500).send(e));
}).post('/closed', (req, res) => {
    gitlab.listClosedIssues(req.body.created_after,req.body.created_before).then(e => res.send(e)).catch(e => res.status(500).send(e));
}).post('/average', (req, res) => {
    gitlab.averageOpenTime(req.body.created_after,req.body.created_before).then(e => res.send(e)).catch(e => res.status(500).send(e));
}).post('/stats', (req, res) => {
    gitlab.issuesStats(req.body.created_after,req.body.created_before).then(e => res.send(e)).catch(e => res.status(500).send(e));
}).get('/recent', (req, res) => {
    gitlab.listRecentIssues().then(e => {res.send(e)}).catch(e => res.status(500).send(e));
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
})