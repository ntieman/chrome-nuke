const path = require('path');
const server = require('../../server.js');
const webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    By = webdriver.By,
    until = webdriver.until;

var serverStarted = false;

function ChromeNukeWorld() {
    
    this.getDriver = function() {
        if(!this.driver) {
            var o = new chrome.Options();

            o.addExtensions([path.join(__dirname, '../../dist/chrome-nuke.zip')]);
            o.excludeSwitches('test-type');

            var s = new chrome.ServiceBuilder().build();

            this.driver = new chrome.Driver(o, s)
        }

        return this.driver;
    };
    
    this.startServer = function() {
        if(!server.listening) {
            server.start();
        }
    };

    this.stopServer = function() {
        if(server.listening) {
            server.stop();
        }
    };

}

module.exports = function() {
    this.World = ChromeNukeWorld;
};