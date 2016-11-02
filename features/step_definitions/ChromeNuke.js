const assert = require('assert');
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const extensionID = '';

module.exports = function() {

    this.When(/^I start the test server$/, function () {
        this.startServer();
    });

    this.When(/^navigate to "([^"]*)"$/, { timeout: 15000 }, function (url, callback) {
        this.getDriver().get(url).then(function() {
            callback();
        });
    });

    this.When(/^activate the extension$/, function (callback) {
        this.getDriver().executeAsyncScript(function() {
            var callback = arguments[arguments.length - 1];

            chrome.runtime.sendMessage(extensionID, {action: 'arm'}, function() {
                callback();
            });
        }).then(function() {
            callback();
        });
    });

    this.When(/^click on the first image$/, function (callback) {
        var scenario = this;
        var imgSize;
        var imgPos;

        this.getDriver()
            .findElements(By.css('img'))
            .then(function(imgs) {
                scenario.firstImage = imgs[0];
                scenario.imageCount = imgs.length;

                return scenario.firstImage.getSize();
            }).then(function(size) {
                imgSize = size;

                return scenario.firstImage.getLocation();
            }).then(function(location) {
                imgPos = location;

                return scenario.getDriver().findElement(By.css('#chrome-nuke-overlay'));
            }).then(function(overlay) {
                return new webdriver.ActionSequence(scenario.getDriver())
                    .mouseMove(overlay, {x: imgPos.x + imgSize.width / 2, y: imgPos.y + imgSize.height / 2})
                    .click();
            }).then(function() {
                callback();
            });
    });

    this.Then(/^The explosion animation should play$/, function (callback) {
        this.getDriver()
            .findElements(By.xpath("//img[contains(@src,'fire.gif')]"))
            .then(function(img) {
                assert(img.length > 0);
                callback();
            })
    });

    this.Then(/^the first image should be removed$/, function (callback) {
        var scenario = this;

        this.getDriver()
            .findElements(By.css('img'))
            .then(function(imgs) {
                assert.equal(imgs.length, scenario.imageCount - 1);
                callback();
            });
    });

    this.After(function(scenario) {
        if(this.driver) {
            this.driver.quit();
        }
    });

};
