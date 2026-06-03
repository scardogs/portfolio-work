const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log('---VAPID_START---');
console.log(JSON.stringify(vapidKeys));
console.log('---VAPID_END---');
