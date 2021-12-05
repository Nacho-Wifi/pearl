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

const Map = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location denied');
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

  const getPlaces = async (type, location) => {
    // let radius = 1000;

    const nearbyServiceWithGoogleType = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
    const nearbyServiceWithoutGoogleType = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
    const api = `&key=${GOOGLE_PLACES_API}`;

    const locationUrl = `location=${location.coords.latitude},${location.coords.longitude}`;
    const typeData = `&type=${type}`;

    let url;
    if (type === 'park') {
      url = `${nearbyServiceWithGoogleType}${locationUrl}&rankby=distance${typeData}${api}`;
    }

    let nearbySpots = () => {
      fetch(url);
    };

    let newPromise = new Promise((res, rej) => {
      res(
        fetch(url)
          .then((res) => res.json())
          .then((res) => {
            return res.results.map((element) => {
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
            setSearchResults(value);
            return value;
          })
      );
    });
    return newPromise;
  };

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
          ></MapView>
        </View>
      );
    } else if (location) {
      text = JSON.stringify(location);
      return (
        <View style={styles.container}>
          <Text>Resources Near You</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => getPlaces('park', location)}
          >
            <Text>Parks</Text>
          </TouchableOpacity>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          >
            {searchResults.map((place) => {
              return (
                <Marker
                  title={`${place.name}`}
                  description={`${place.vicinity}`}
                  key={place.id}
                  coordinate={{
                    latitude: place.marker.latitude,
                    longitude: place.marker.longitude,
                  }}
                  pinColor={'#83CA9E'}
                />
              );
            })}
          </MapView>
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
