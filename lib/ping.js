var request = require('request'),
  statusCodes = require('http').STATUS_CODES
  mailer = require('./mailer');

function Ping(opts) {
  this.website = '';
  this.timeout = 15;
  this.handle = null;
  this.init(opts);
}

Ping.prototype = {
  init: function(opts) {
    var self = this;
    self.website = opts.website;
    self.timeout = (opts.timeout * (60*1000));

    self.start();
  },
  start: function() {
    var self = this, time = Date.now();

    console.log("\nLoading... " + self.website + "\nTime: " + time + "\n");

    self.handle = setInterval(function () {
      self.ping();
    }, self.timeout);
  },

  ping: function () {
        var self = this, currentTime = Date.now();
        try {
            // send request
            request(self.website, function (error, res, body) {
                // Website is up
                if (!error && res.statusCode === 200) {
                    self.isOk();
                }
                // No error but website not ok
                else if (!error) {
                    self.isNotOk(res.statusCode);
                }
                // Loading error
                else {
                    self.isNotOk();
                }
            });
        }
        catch (err) {
            self.isNotOk();
        }
    },
    isOk: function () {
        this.log('UP', 'OK');
    },
    isNotOk: function (statusCode) {
        var time =  Date.now(),
            self = this,
            time = self.getFormatedDate(time),
            msg = statusCodes[statusCode + ''],
            htmlMsg = '<p>Time: ' + time;
            htmlMsg +='</p><p>Website: ' + self.website;
            htmlMsg += '</p><p>Message: ' + msg + '</p>';
        this.log('DOWN', msg);
        // Send admin and email
        mailer({
            from: '666betatest666@gmail.com',
            to: 'koinu.isaac@gmail.com',
            subject: self.website + ' is down',
            body: htmlMsg
        }, function (error, res) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(res.message || 'Failed to send email');
            }
        });
    },
    log: function (status, msg) {
        var self = this,
            time = Date.now(),
            output = '';
        output += "\nWebsite: " + self.website;
        output += "\nTime: " + time;
        output += "\nStatus: " + status;
        output += "\nMessage:" + msg  + "\n";
        console.log(output);
    },
    getFormatedDate: function (time) {
        var currentDate = new Date(time);
        currentDate = currentDate.toISOString();
        currentDate = currentDate.replace(/T/, ' ');
        currentDate = currentDate.replace(/\..+/, '');
        return currentDate;
    }
}
module.exports = Ping;
