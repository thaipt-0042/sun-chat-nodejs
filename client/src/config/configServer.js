const config = {
  API_URL: process.env.REACT_APP_API_URL,
  SOCKET_ENDPOINT: process.env.REACT_APP_SOCKET_ENDPOINT,
  LOCALE: process.env.REACT_APP_LOCALE || 'en',
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
  AUTHORIZATION_HEADER: process.env.REACT_APP_AUTHORIZATION_HEADER || 'jwt_authorization',
  CALLING_NOTIFICATION_LOCATION: require('../sound/notification.mp3'),
  TIME_SHOW_NOTIFICATION: 45 //seconds
};

export default config;
