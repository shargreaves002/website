require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const projectName = "website";
const bodyParser = require('body-parser');
// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_PASS = process.env.GMAIL_PASS;
// const GMAIL_USER = 'fury157@gmail.com';
// const GMAIL_PASS = 'momlovesme';

app.use(bodyParser.json());
app.use(express.static('dist/' + projectName));
app.use(bodyParser.urlencoded({extended: false}));

/*app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});*/

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
/*
// POST route from contact form
app.post('/contact', (req, res) => {
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fury157@gmail.com',
      pass: 'momlovesme'
    }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: 'Your sender info here', // This is ignored by Gmail
    to: 'fury157@gmail.com',
    subject: 'New message from website',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, res) => {
    if (error) {
      res.render('src/app/contact-failure') // Show a page indicating failure
    }
    else {
      res.render('src/app/contact-success') // Show a page indicating success
    }
  })
});*/

app.post('https://fierce-sands-07111.herokuapp.com/contact', (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: 'fury157@gmail.com',
      pass: 'momlovesme'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'Someone@test.com', // sender address
    to: 'sarahhargreaves10@gmail.com', // list of receivers
    subject: 'A Postcard For You!', // Subject line
    text: 'Postcard', // plain text body
    html: '<b>From my app</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('src/app/contact-failure') // Show a page indicating failure
    }
    else {
      res.render('src/app/contact-success') // Show a page indicating success
    }
  });
});
