require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const projectName = "website";
const bodyParser = require('body-parser');
const xoauth2 = require('xoauth2');
const { google } = require("googleapis");
const fs = require('fs');
const readline = require('readline');
const oauth2Client = new OAuth2(
  '49997474895-qnblhjf6t3kba3fsidfc0pteq46g9n84.apps.googleusercontent.com', // Client ID
  'RmCYvU7vhuCD1hUOaSLZoeYx', // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);
// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_PASS = process.env.GMAIL_PASS;

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

  // If modifying these scopes, delete token.json.
  var SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
  ];
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
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
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

    return new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  }

  function sendMessage(auth) {
    const raw = makeBody('sarahhargreaves10@gmail.com',
                      'sarahhargreaves10@gmail.com',
                    'An email from your website!',
                    req.name + ' <' + req.email + '> ' + 'says: ' + req.message);
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




  // all nodemailer stuff

  // create reusable transporter object using the default SMTP transport
  // req.setTimeout(500000);

  /*oauth2Client.setCredentials({
    refresh_token: '1//04WikNtQN-u0NCgYIARAAGAQSNwF-L9IrjyqKUS979fAOIfY7oQcYV14Yg624RjDAL59ZqR5iWo3y0SKrjVpwYLrd2UsUDoJtL8c'
  });
  const accessToken = oauth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'sarahhargreaves10@gmail.com',
      /!*clientId: '49997474895-qnblhjf6t3kba3fsidfc0pteq46g9n84.apps.googleusercontent.com',
      clientSecret: 'RmCYvU7vhuCD1hUOaSLZoeYx',
      refreshToken: '1//04WikNtQN-u0NCgYIARAAGAQSNwF-L9IrjyqKUS979fAOIfY7oQcYV14Yg624RjDAL59ZqR5iWo3y0SKrjVpwYLrd2UsUDoJtL8c',*!/
      accessToken: accessToken
    }
  });

  // setup email data
  let mailOptions = {
    from: 'sarahhargreaves10@gmail.com', // This is ignored by Gmail
    to: 'sarahhargreaves10@gmail.com', // list of receivers
    subject: 'You got a new message from the website!', // Subject line
    text: req.body.name + '(' + req.body.email + ') says: ' + req.body.message // plain text body
  };

  // send mail with the transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // res.render('src/app/contact-failure'); // Show a page indicating failure
      console.log(error);
    }
    else {
      // res.render('src/app/contact-success'); // Show a page indicating success
      console.log(info);
    }

    transporter.close();
  });*/
});
