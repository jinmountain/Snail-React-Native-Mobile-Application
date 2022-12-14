import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  PanResponder,
  Animated,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as MediaLibrary from 'expo-media-library'

// Components
import MainTemplate from '../components/MainTemplate';
import HeaderBottomLine from '../components/HeaderBottomLine';
import { HeaderForm } from '../components/HeaderForm';
import SnailBottomSheet from '../components/SnailBottomSheet';
import ImageBrowser from '../components/ImagePicker/ImageBrowser';
import CollapsibleTabView from '../components/CollapsibleTabView';

// Design

// Hooks

// color
import color from '../color';

// icon
// import expoIcons from '../expoIcons';

const flatListData = [
  {
    text: '128u301389013810'
  },
  {
    text: '12jo1j2eonoivjso'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  },
  {
    text: '1231jijovsjeoifj'
  }
]

const SnailScreen = ({ navigation }) => {
  // image browser callback and selected photos
  const [ selectedFiles, setSelectedFiles ] = useState([]);

  const [ showBottomSheet, setShowBottomSheet ] = useState(true);
  const switchBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  const [ mode, setMode ] = useState(null);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y }
    ],{
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gs) => {
      console.log("gs.vx: ", gs.vx);
      console.log("gs.dx: ", gs.dx);
      if (gs.dx > 50) {
        console.log("go back");
      }
      // console.log(typeof(pan.x));
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  });

  const [ files, setFiles ] = useState([]);
  const maxNumOfFiles = 10;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableHighlight
          style={{ borderWidth: 1, alignItems: 'center' }}
          underlayColor={color.grey4}
          onPress={() => {
            // setMode('cTabView');
          }}
        >
          <View>
            <Text>Show C Tab View</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={{ borderWidth: 1, alignItems: 'center' }}
          underlayColor={color.grey4}
          onPress={() => {
            setMode('imageBrowser');
          }}
        >
          <View>
            <Text>Show ImageBrowser</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={{ borderWidth: 1, alignItems: 'center', paddingVertical: RFValue(15) }}
          underlayColor={color.grey4}
          onPress={() => {
            setShowBottomSheet(true);
            setMode('bottomSheet');
          }}
        >
          <View>
            <Text>Show bottomSheet</Text>
          </View>
        </TouchableHighlight>
      </View>
      {
        mode === 'imageBrowser' &&
        <ImageBrowser 
          // maximum number of photos to choose
          max={maxNumOfFiles}
          // Whether to load extra fields like location. Loading all of the information will reduce performance. by default false
          loadCompleteMetadata={false}

          loadCount={50}
          emptyStayComponent={null}
          preloaderComponent={<ActivityIndicator size='large'/>}
          mediaType={[MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video]}
          onChange={(num, onSubmit)  => {
            if (num === maxNumOfFiles) {
              console.log("selected max number of files");
            }
            onSubmit();
          }}
          callback={(callback) => {
            console.log(callback);
            setSelectedFiles(callback);
          }}
          onFinish={(files) => {
            setSelectedFiles(files);
          }}
          goBack={() => {
            setMode(null);
          }}
          noCameraPermissionComponent={null}
          renderExtraComponent={null}
        /> 
      }
       
      {
        mode === 'bottomSheet' &&
        <SnailBottomSheet
          content={
            <View>
              <Text>HAHAHAHAHAH</Text>
              <View style={{borderWidth: 1 }}>
                <FlatList
                  data={flatListData}
                  renderItem={({ item, index }) => {
                    return (
                      <View> 
                        <Text>{item.text}</Text>
                      </View>
                    )
                  }}
                  contentContainerStyle={{
                    paddingBottom: 200
                  }}
                  keyExtractor={(item, index ) => index.toString()}
                />
              </View>
            </View>
          }
          setMode={setMode}
          showBottomSheet={showBottomSheet}
          switchBottomSheet={switchBottomSheet}
          closeAction={() => {navigation.goBack();}}
        />
      }
      {
        mode === 'cTabView' &&
        <CollapsibleTabView/>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  box: {
    width: RFValue(300),
    height: RFValue(500),
    backgroundColor: color.red2
  },
});

export default SnailScreen;