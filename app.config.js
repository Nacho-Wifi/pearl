// import { GOOGLE_MAPS_API_KEY } from '@env';

export default ({ config }) => {
  config.ios.config.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; //GOOGLE_MAPS_API_KEY;
  return config;
};
