require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const projectName = "website";
const bodyParser = require('body-parser');
const xoauth2 = require('xoauth2');
// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_PASS = process.env.GMAIL_PASS;
// const GMAIL_USER = 'fury157@gmail.com';
// const GMAIL_PASS = 'momlovesme';

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
  // create reusable transporter object using the default SMTP transport
  // req.setTimeout(500000);
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: '49997474895-qnblhjf6t3kba3fsidfc0pteq46g9n84.apps.googleusercontent.com',
      clientSecret: 'RmCYvU7vhuCD1hUOaSLZoeYx',
      refreshToken: '1//04P6OSRX5bBfRCgYIARAAGAQSNwF-L9IrL_0rFhGpCHRIjL8vb1RZNyHR1vCH9JScTtInjIn_-_vBslPPH4_bq3fMWvY4twFIIJQ'
    }
  });

  // setup email data
  let mailOptions = {
    from: process.env.GMAIL_USER, // This is ignored by Gmail
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
  });
});
