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
app.use(bodyParser.urlencoded({extended: true}));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.set('port', process.env.PORT || 5000);

app.get('*',function (req, res) {
  // this tells the server to redirect all url calls to the index where our angular router will do the work
  res.sendFile(__dirname + '/dist/' + projectName + 'index.html')
});

app.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

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
});
