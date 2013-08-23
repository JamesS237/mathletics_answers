chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(JSON.stringify(details));
  },
  {urls: ["<all_urls>"]}
);