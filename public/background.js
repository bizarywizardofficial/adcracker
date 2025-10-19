// chrome.cookies.getAll({ domain: "localhost" }, function (cookies) {

function enableAdsAndTrackingRules() {
  console.log("Adblocking is enabled");
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ["easylist", "block_third_party_cookies"],
  });
}
enableAdsAndTrackingRules();
