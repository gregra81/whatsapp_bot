/**
 * configs
 */

// this sets the time of day when gestures will run
var sendGestureAt = ['11:00', '14:00'];

// The person to send the gesture to
var contact = 'Nadia';

// The gestures array
const gesturesArray = ['חושב עלייך, שושי','מה קורה, מה עושה?','איך הולך אהובה?','היי בייבי, מה נשמע?'];

/**
 * End config part
 */

// Global contacts object from whatsapp
var contacts = [];

function pickRandomGesture() {
  return gesturesArray[Math.floor(Math.random() * gesturesArray.length)];
}

function shouldSendGesture() {
  var now = new Date(),
    currentHours = now.getHours(),
    currMinutes = now.getMinutes();

  for (var i=0; i < sendGestureAt.length; i++) {
    var sendAtArr = sendGestureAt[i].split(':');
    if (parseInt(sendAtArr[0]) === currentHours && parseInt(sendAtArr[1]) === currMinutes) {
      return true;
    }
  }

  return false;
}


function setUpContacts() {
  var Chats = window.Store.Chat.models;
  for (var chat in Chats) {
    if (isNaN(chat)) {
      continue;
    }
    var temp = {};
    temp.contact = Chats[chat].__x_formattedTitle;
    temp.id = Chats[chat].__x_id;
    temp.cid = chat;
    contacts.push(temp);
  }
}

function sendWhatsappMessage(contact, text) {
  var Chats = window.Store.Chat.models;
  contacts.forEach(function(contactObj) {
    if (contactObj.contact === contact && text.length > 0) {
      Chats[contactObj.cid].sendMessage(text);
    }
  });
}

function runGesturesEngine(contact) {
  setInterval(function() {
    if (shouldSendGesture()) {
      sendWhatsappMessage(contact, pickRandomGesture());
      console.log('Gesture Engine sent a successful message to ' + contact);
    } else {
      console.log('Gesture Engine skipped sending a message');
    }
  }, 60000);

}

window.addEventListener('load', function(){

  // wait for the whatsapp data to be ready
  var inter = setInterval(function(){
    if (window.Store.Chat.models.length > 0) {
      clearInterval(inter);
      setUpContacts();
      runGesturesEngine(contact);
    }
  }, 200);

});

