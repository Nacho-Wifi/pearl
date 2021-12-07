import MapView from 'react-native-maps';
import {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  onCalloutPress,
} from 'react-native-maps';
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
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Location from 'expo-location';
import { GOOGLE_PLACES_API } from '@env';

const makeCall = (num) => {
  Linking.openURL(`tel:${num}`);
};

const redirectToGoogleMaps = (place) => {
  //you can't have a ' ' space between search terms / name in query to get directions ... cut that out using regex & replace with the needed '+'
  const name = place.name.replace(/\s/g, '+');
  const linkToLocation = `https://www.google.com/maps?saddr=My+Location&daddr=${name}`;
  Linking.openURL(linkToLocation);
};

const Map = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location denied');
        return;
      }

      let coordinates = await Location.getCurrentPositionAsync({
        //takes too long to load if we use anynthing but lowest accuracy ... and this accuracy level still works for our purposes
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
  }, []);

  const getPlaces = async (type, location) => {
    const nearbyServiceWithGoogleType = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
    const nearbyServiceWithoutGoogleType = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
    const api = `&key=${GOOGLE_PLACES_API}`;

    const locationUrl = `location=${location.coords.latitude},${location.coords.longitude}`;
    const typeData = `&type=${type}`;

    let url;
    if (type === 'park') {
      //google places api has certain 'types' that it can search for - but of the search results we're interested in, google's 'types' only include parks ... so we are separating park out because we can search by type for that vs. text string search
      url = `${nearbyServiceWithGoogleType}${locationUrl}&rankby=distance${typeData}${api}`;
    } else {
      //this is the api we'll call if we aren't looking up a google-provided type, like therapist or meditiation
      url = `${nearbyServiceWithoutGoogleType}${locationUrl}&query=${type}&rankby=distance${api}`;
    }

    //like a get request to the places api
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
  if (errorMsg) {
    text = errorMsg;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Resources</Text>
        <Text style={{ textAlign: 'center' }}>
          Allow location to find local resources:
        </Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={mapRegion}
        ></MapView>
        <Text style={styles.hotlineNumbers}>
          National Suicide Prevention Lifeline:
        </Text>
        <Text style={styles.phoneNumber} onPress={() => makeCall('8002738255')}>
          (800) 273-8255
        </Text>
        <Text style={styles.hotlineNumbers}>
          Crisis Text Line: Text HOME to 741741
        </Text>
      </SafeAreaView>
    );
  } else if (location) {
    text = JSON.stringify(location);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <Text style={styles.header}>Resources</Text>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>
            Search for soothing places near you:
          </Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          >
            {searchResults.map((place) => {
              return (
                <Marker
                  key={place.id}
                  coordinate={{
                    latitude: place.marker.latitude,
                    longitude: place.marker.longitude,
                  }}
                  pinColor={'#D3F6F3'}
                >
                  <Callout
                    onPress={() => {
                      redirectToGoogleMaps(place);
                    }}
                    style={styles.callout}
                  >
                    <Text> {`${place.name}`}</Text>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
          <View style={styles.options}>
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
          </View>
          <Text style={styles.hotlineNumbers}>
            National Suicide Prevention Lifeline:
          </Text>
          <Text
            style={styles.phoneNumber}
            onPress={() => makeCall('8002738255')}
          >
            (800) 273-8255
          </Text>
          <Text style={styles.hotlineNumbers}>
            Crisis Text Line: Text HOME to 741741
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return <Text>Loading ...</Text>;
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
  options: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FBD1B7',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    marginTop: 20,
    width: '100%',
    height: 450,
    marginBottom: 0,
    borderRadius: 60,
  },
  header: {
    fontSize: 40,
    padding: 5,
    marginTop: 15,
  },
  hotlineNumbers: {
    margin: 10,
  },
  phoneNumber: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
