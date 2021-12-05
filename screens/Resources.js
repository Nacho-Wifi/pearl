import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_API } from '@env';
import { set } from 'react-native-reanimated';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location denied');
        return;
      }

      let coordinates = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });

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
    const nearbyServiceWithGoogleType = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
    const nearbyServiceWithoutGoogleType = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
    const api = `&key=${GOOGLE_PLACES_API}`;

    const locationUrl = `location=${location.coords.latitude},${location.coords.longitude}`;
    const typeData = `&type=${type}`;

    let url;
    if (type === 'park') {
      url = `${nearbyServiceWithGoogleType}${locationUrl}&rankby=distance${typeData}${api}`;
    } else {
      url = `${nearbyServiceWithoutGoogleType}${locationUrl}&query=${type}&rankby=distance${api}`;
    }

    let res = await fetch(url);
    let data = await res.json();
    let spotsNearby = data.results.map((element) => {
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
    setSearchResults(spotsNearby);
  };

  let text = 'Waiting for location permission';
  if (loading) {
    return <View>Loading ...</View>;
  } else {
    if (errorMsg) {
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
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <Text style={styles.header}>Resources Near You</Text>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => getPlaces('park', location)}
            >
              <Text>Parks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => getPlaces('therapist', location)}
            >
              <Text>Therapy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => getPlaces('meditation', location)}
            >
              <Text>Meditation</Text>
            </TouchableOpacity>
            <Text>National Suicide Prevention Lifeline: (800) 273-8255</Text>
            <Text>Crisis Text Line: Text HOME to 741741</Text>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Loading ... </Text>
          {/* <Text>Unpersonalized resources</Text>
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
          /> */}
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
  header: {
    fontSize: 25,
    padding: 5,
    marginTop: 50,
  },
});
