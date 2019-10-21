import Constants from 'expo-constants';

const ENV = {
 dev: {
   apiUrl: 'https://masonic-staging-backend.onrender.com',
 },
 prod: {
   apiUrl: 'https://masonic-backend.onrender.com',
   // Add other keys you want here
 }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (__DEV__) {
   return ENV.dev;
 } else {
     return ENV.prod
 }
};

export default getEnvVars;