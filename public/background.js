// chrome.cookies.getAll({ domain: "localhost" }, function (cookies) {

function enableAdsAndTrackingRules() {
  console.log("Adblocking is enabled");
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ["easylist", "block_third_party_cookies"],
  });
}

function disableAdsAndTrackingRules() {
  console.log("Adblocking is disabled");
  chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: ["easylist", "block_third_party_cookies"],
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getMatchedRules") {
    const currentTime = new Date().getTime();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (
        cachedMatchedRules[currentTab.id] &&
        cacheExpirationTime &&
        cacheExpirationTime > currentTime
      ) {
        // Use cached matched rules if they exist and have not expired
        sendResponse({ matchedRules: cachedMatchedRules[currentTab.id] });
      } else {
        chrome.declarativeNetRequest.getMatchedRules(
          { tabId: currentTab.id },
          (matchedRules) => {
            // Cache matched rules and set expiration time to 10 seconds from now
            cachedMatchedRules[currentTab.id] = matchedRules;
            cacheExpirationTime = currentTime + 15000;
            sendResponse({ matchedRules });
          }
        );
      }
    });
  }
  return true; // Need to return true to indicate that we will send a response asynchronously
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ paused: false });
  enableAdsAndTrackingRules();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pause") {
    chrome.storage.local.get(["paused"], (result) => {
      disableAdsAndTrackingRules(); // <-- your existing function
      chrome.storage.local.set({ paused: true });
      sendResponse({ status: "paused" });
    });
  } else {
    enableAdsAndTrackingRules(); // <-- your existing function
    chrome.storage.local.set({ paused: false });
    sendResponse({ status: "active" });
  }
  return true; // keep the message channel open for async responses
});
