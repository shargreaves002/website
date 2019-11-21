require('dotenv').config();
const renderModuleFactory = require('@angular/platform-server');
const { AppServerModuleNgFactory } = require('./dist/website-server/main');
const express = require('express');
const app = express();
const projectName = "website";
const { google } = require("googleapis");
const fs = require('fs');
const indexHtml = fs.readFileSync(__dirname + '/dist/index.html', 'utf-8').toString();
// const readline = require('readline');

app.use(express.json());
app.use(express.static('dist/' + projectName));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.set('port', process.env.PORT || 5000);

/*app.get('*',function (req, res) {
  // this tells the server to redirect all url calls to the index where our angular router will do the work
  res.sendFile(__dirname + '/src/index.html');
});*/

app.route('*').get((req, res) => {

  renderModuleFactory.renderModuleFactory(AppServerModuleNgFactory, {
    document: indexHtml,
    url: req.url
  })
    .then(html => {
      res.status(200).send(html);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

// catch a post request made to the contact form, use it to send an email

app.post('/api/contact', (req, res) => {

  const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) throw err;
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content.toString()), sendMessage);
  });

  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) throw err;
      oAuth2Client.setCredentials(JSON.parse(token.toString()));
      callback(oAuth2Client);
    });
  }

  function makeBody(to, from, subject, message) {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
    ].join('');

    return Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  }

  function sendMessage(auth) {
    const raw = makeBody('sarahhargreaves10@gmail.com',
                      'sarahhargreaves10@gmail.com',
                    req.body.name + ' would like to contact you!',
                  'Please reply to:' + req.body.email + '\n\n\n' + req.body.message);
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
        raw: raw
      }
    }, (err, response) => {
      res.send(err || response);
    });
  }
});
