const webpush = require('web-push');

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:anggerbayusentiko@gmail.com', // IMPORTANT: Replace with your actual email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

module.exports = {
  webpush,
  vapidKeys,
};
