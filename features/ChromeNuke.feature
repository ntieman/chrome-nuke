Feature: Chrome Nuke
  As a web browser
  I want to be able to remove unwanted elements
  So that I can browse pages

  Scenario: Remove Element
    When I start the test server
    And navigate to "http://localhost:3000/"
    And activate the extension
    And click on the first image
    Then the first image should be removed
