require('dotenv').config();
const express = require('express');
const app = express();
const projectName = "website";
const bodyParser = require('body-parser');
const { google } = require("googleapis");
const fs = require('fs');
const readline = require('readline');

app.use(bodyParser.json());
app.use(express.static('dist/' + projectName));
app.use(bodyParser.urlencoded({extended: false}));

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

app.get('*',function (req, res) {
  // this tells the server to redirect all url calls to the index where our angular router will do the work
  res.sendFile(__dirname + '/src/index.html');
});

app.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

// catch a post request made to the contact form, use it to send an email

app.post('/api/contact', (req, res) => {

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
  const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), sendMessage);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
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

    return new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  }

  function sendMessage(auth) {
    const raw = makeBody('sarahhargreaves10@gmail.com',
                      'sarahhargreaves10@gmail.com',
                    'An email from your website!',
                    req.body.name + ' <' + req.body.email + '> ' + 'says: ' + req.body.message);
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
        raw: raw
      }
    }, function(err, response) {
      console.log(err || response);
    });
  }
});
