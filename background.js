chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if(match(details.url)) {
    getAnswer(details.url);
  }
}, {
  urls: ["http://west.cdn.mathletics.com/*"]
})

chrome.webRequest.onBeforeSendHeaders.addListener(function (details){
  if(match(details.url)) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Access-Control-Allow-Origin') {
        details.requestHeaders.splice(i, 1);
        break;
      }
    }

    return {requestHeaders: details.requestHeaders};
  }
}, {
  urls: ["http://west.cdn.mathletics.com/*"]
}, [
  "blocking",
  "requestHeaders"
])

function match(url) {
  return !!url.match(/west.cdn.mathletics.com\/curriculum/) && !!url.match(/.QuestionXML.xml/) && !url.match(/me:9292/)
}

function getAnswer(url) {
  url = "http://localhost:9292/"+ url.substring(7)

  $.ajax({
    type: "GET",
    url: url,
    dataType: "xml",
    success: xmlParser
   });

  return true;
}

var notification;

function xmlParser(xml) {
  var answer = $(xml).find("actAnswerHashEnglish").html();

  try {
    answer = answer.split(';').join(', ')
  } catch(e) {}

  try {
    answer = answer.split(',').join(', ')
  } catch(e) {}

  if(notification) notification.close();

  notification = notify.createNotification("Mathletics Answer", {body: answer, icon: "icon.png"})
}
