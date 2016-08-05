var nodmailer = require('nodemailer'),
config = require('../config'),
mailer;

mailer = function (opts, fn) {
  var mailOpts, smtpTrans;

  try {
    smtpTrans = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
  }
  catch (err) {
    fn('Nodemailer could not create TRANSPORT!!!!!', '');
    return;
  }

  mailOpts = {
    from: opts.from,
    replyTo: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.body
  };

  try {
    smtpTrans.sendMail(mailOpts, function (err, res) {
      if (err) {
        fn(true, err);
      }

      else {
        fn(false, res.message)
      }
    });
  }
  catch(err) {
    fn('Nodemailer could NOTTTTT send mail', '');
  }
};

module.exports = mailer;
