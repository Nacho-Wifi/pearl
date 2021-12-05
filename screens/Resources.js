import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_API } from '@env';

const getPlaces = async (type, location) => {
  console.log('I GO TO LOUUUUUD PLACEEEES', location);
  let radius = 1000;

  const nearbyService = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
  const queryBase = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
  const api = `&key=${GOOGLE_PLACES_API}`;

  const locationUrl = `location=${location.coords.latitude},${location.coords.longitude}`;
  const typeData = `&type=${type}`;

  let url = `${nearbyService}${locationUrl}&rankby=distance${typeData}${api}`;
  console.log('DO WE HIT THIS????', url);

  let newPromise;
  newPromise = new Promise((res, rej) => {
    res(
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          return res.results.map((element) => {
            console.log('ELEMENT!!!!', element);
            return {
              id: element.place_id,
              name: element.name,
              rating: element.rating,
              vicinity: element.vicinity,
              marker: {
                latitude: element.geometry.location.lat,
                longitude: element.geometry.location.lng,
              },
            };
          });
        })
        .then((value) => {
          return value;
        })
    );
  });
  return newPromise;
};

const Map = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let coordinates = await Location.getCurrentPositionAsync({});
      setLocation(coordinates);

      setMapRegion({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0922,
      });
    })();
    setLoading(false);
  }, []);

  let text = 'Waiting..';
  if (loading) {
    return <View>Loading ...</View>;
  } else {
    if (errorMsg) {
      console.log('IS THERE AN ERROR', errorMsg);
      text = errorMsg;
      return (
        <View style={styles.container}>
          <Text>Resources With an Error Flair</Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={mapRegion}
          />
        </View>
      );
    } else if (location) {
      console.log('ARE WE HITTING LOCATION?', location);
      text = JSON.stringify(location);
      return (
        <View style={styles.container}>
          <Text>Resources Near You</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => getPlaces('park', location)}
          ></TouchableOpacity>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Unpersonalized resources</Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={{
              latitude: 47,
              longitude: 74,
              longitudeDelta: 0.0922,
              latitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
  }
};
export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FBD1B7',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '90%',
    height: 300,
  },
});
