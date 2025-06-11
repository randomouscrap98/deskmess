// This file is inserted into index.html to create a test scenario.
// No matter what, we will add some test code to be run AFTER the entire
// page loads. Each test is meant to be run one after another, though some tests
// will need a page reload before they can be run. Tests are dependent on each other
// unfortunately, as state needs to be tested.

// Immediately disable alerts
let TEST_alerts = [];
window.altAlert = function(msg) {
  console.warn(msg);
  TEST_alerts.push(msg);
}

const RESUMETESTPARAM = "resumetest";
var TEST_Current = 0;
function TEST_ReloadPage(extraQuery) {
  let url = window.location.pathname + `?${RESUMETESTPARAM}=` + (TEST_Current + 1);
  if(extraQuery) url += "&" + extraQuery;
  window.location.href = url;
}

var TESTS = [
  function() {
    console.log("Basic 'clicking on things' test");
    window['action-newtext'].click();
    window['action-newchat'].click();
    window['action-newtodo'].click();
    window['action-newdrawing'].click();
    let cct = function(id, type) {
      let cid = REFPREPEND + id;
      if(getCardId(window[cid]).textContent != String(id)) {
        throw "Bad card id";
      }
      let ctype = getCardType(window[cid]).textContent;
      if(ctype != type) {
        throw "Bad card type, expected " + type + " got " + ctype;
      }
      let rid = getCardRef(window[cid]).textContent;
      if(rid != cid) {
        throw "Bad card ref, expected " + cid + " get " + rid;
      }
    };
    cct(1, "text");
    cct(2, "chat");
    cct(3, "todo");
    cct(4, "drawing");
    window['action-sidebar'].click();
    if(isHidden(window['sidebar'])) {
      throw "Sidebar hidden after click";
    }
    window['tool-toggle'].click();
    if(isHidden(window['tool-tray'])) {
      throw "Tooltray hidden after click";
    }
    let cbd = function(id, active) {
      if(window[id].classList.contains("deactivated") == active) {
        throw "Expected active=" + active + ", didn't get that"
      }
    };
    // IDC what these do, just make sure they don't crash on click or unclick
    window['action-resetview'].click();
    window['action-gridsnap'].click();
    window['action-pageview'].click();
    window['action-darkmode'].click();
    window['action-modern'].click();
    cbd('action-gridsnap', true);
    cbd('action-pageview', true);
    cbd('action-darkmode', true);
    cbd('action-modern', true);
    window['action-resetview'].click();
    window['action-gridsnap'].click();
    window['action-pageview'].click();
    window['action-darkmode'].click();
    window['action-modern'].click();
    cbd('action-gridsnap', false);
    cbd('action-pageview', false);
    cbd('action-darkmode', false);
    cbd('action-modern', false);
  },
  function() {
    console.log("Set parent test");
    var card1 = window[REFPREPEND + "1"];
    var card2 = window[REFPREPEND + "2"];
    // set one card to be a parent of the other, through the functions
    setCardParent(card1, card2.id);
    // Open the menu first, just in case
    // getCardMenu(card1).click();
    // card1.querySelector(".set-parent").click();
    // // Then click on card 2
    // card2.click();
    // Check if card2 has card1 as an (only) child
    var children = Array.from(getCardChildren(card2));
    if(children.length != 1) {
      throw `Expected one child of card2, got ${children.length}`;
    }
    if(children[0] != card1) {
      throw `Expected first child to be card1, got ${children[0]}`;
    }
  },
  function() {
    console.log("Bring to front tests");
    // Can only test to see if they throw an exception
    var card1 = window[REFPREPEND + "1"];
    var card2 = window[REFPREPEND + "2"];
    var card3 = window[REFPREPEND + "2"];
    bringToFront(card3);
    bringAllToFront(card2); // this has children
    bringAllToFront(card1); // this has none
  },
  function() {
    TEST_ReloadPage("server=test1");
  },
  function() {
    console.log("Creating new test1 page");
  },
];

window.addEventListener("load", function() {
  window.onerror = function customErrorHandler(msg, url, lineNo, columnNo, error) {
    // Log the error to the console or send it to a server
    let output = `FAIL ON TEST ${TEST_Current}\n\nError: ${msg}\nURL: ${url}\nLine Number: ${lineNo}\nColumn Number: ${columnNo}\nError Object: ${error}`;
    console.error(output);
    alert(output);
    // Return true to prevent the default error handling
    return true;
  };

  // See if we need to resume from a certain test. Otherwise, start 
  // from the beginning
  const currentUrl = new URL(window.location.href);
  const queryParams = new URLSearchParams(currentUrl.search);
  if(!queryParams.has(RESUMETESTPARAM)) {
    if(!confirm(`Starting ${TESTS.length} tests from the beginning. The page ` +
      "may reload several times. Ready?")) {
      return;
    }
  } else {
    TEST_Current = Number(queryParams.get(RESUMETESTPARAM));
  }
  for(; TEST_Current < TESTS.length; TEST_Current++) {
    console.log("RUNNING TEST " + TEST_Current);
    TESTS[TEST_Current]();
  }
  alert("All tests pass!");
});
