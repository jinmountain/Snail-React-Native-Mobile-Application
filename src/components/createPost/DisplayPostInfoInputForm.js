import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  View,
  ScrollView, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  Pressable
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// font
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

// Components
import DefaultUserPhoto from '../defaults/DefaultUserPhoto';
import { InputFormBottomLine } from '../InputFormBottomLine';

// Designs
import { AntDesign } from '@expo/vector-icons';

// Hooks
import {
  convertEtcToHourMin
} from '../../hooks/useConvertTime';
import { capitalizeFirstLetter } from '../../hooks/capitalizeFirstLetter';

// Firebase
import {
  getUserInfoFire
} from '../../firebase/user/usersGetFire';
import {
  getTechnicians
} from '../../firebase/business/businessGetFire';

// Color
import color from '../../color';

// expo icons
import { 
  antdesignStaro,
  chevronDown
} from '../../expoIcons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const techBoxWidth = windowWidth/3;

const TechBox = ({
  techId,
}) => {
  const [ techData, setTechData ] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getUserInfo = getUserInfoFire(techId);
    getUserInfo
    .then((result) => {
      isMounted && setTechData(result);
    })
    .catch((error) => {

    });

    return () => {
      isMounted = false;
    }
  }, []);

  return (
    techData &&
    <View style={styles.techInnerContainer}>
      { 
        techData.photoURL
        ?
        <Image style={styles.techImage} source={{ uri: techData.photoURL }}/>
        : 
        <DefaultUserPhoto 
          customSizeBorder={RFValue(57)}
          cutomSizeUserIcon={RFValue(37)}
        />
      }
      <View style={styles.techInfoContainer}>
        <Text style={styles.techUsernameText}>
          {techData.username}
        </Text>
      </View>
    </View>
  )
};

const DisplayPostInfoInputForm = ({ 
  currentUserId,
  postPrice,
  setPostPrice,
  postETC,
  setPostETC,
  selectedTechs,
  setSelectedTechs,
  postTitle,
  setPostTitle,
  postService,
  setPostService,
  setIsModalVisible,
  setPickerType
}) => {
  const [ techFetchLast, setTechFetchLast ] = useState(null);
  const [ techFetchState, setTechFetchState ] = useState(false);
  const [ techFetchSwitch, setTechFetchSwitch ] = useState(true);
  const [ currentTechs, setCurrentTechs ] = useState([]);

  // get current techs
  useEffect(() => {
    let isMounted = true;
    // get current technicians
    if (techFetchSwitch && !techFetchState) {
      setTechFetchState(true);
      const fetchTechs = getTechnicians(
        currentUserId, 
        techFetchLast,
      );
      fetchTechs
      .then((result) => {
        setCurrentTechs(result.techs);
        isMounted && setTechFetchLast(result.lastTech);
        if (!result.lastTech) {
          isMounted && setTechFetchSwitch(false);
        }
        isMounted && setTechFetchState(false);
      })
    } else {
      console.log(
        "techFetchSwitch: "
        + techFetchSwitch
        + "techFetchState: "
        + techFetchState
      );
    };

    return () => {
      isMounted = false;
    }
  }, []);

  const [ clickedAll, setClickedAll ] = useState(false);

  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.infoInputFormContainer}>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postService 
          ?
          <View style={styles.textInputLabelContainer}>
            <View style={styles.textInputLabelInner}>
              <View style={styles.textInputLabelInnerIcon}>
                <AntDesign name="clockcircleo" size={RFValue(11)} color={color.black1} />
              </View>
              <Text style={styles.textInputLabelText}>Service Type</Text>
            </View>
          </View>
          : null
        }
        <TouchableOpacity
          onPress={() => {
            setPickerType("service");
            setIsModalVisible(true);
            setPostETC(null);
          }}
        >
          <View>
            {
              postService
              ?
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>{capitalizeFirstLetter(postService)}</Text>
              </View>
              :
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>Choose Service Type</Text>
              </View>
            }
          </View>
        </TouchableOpacity>
      </View>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postTitle 
          ? 
          <View style={styles.textInputLabelContainer}>
            <Text style={styles.textInputLabelText}>Title</Text>
          </View>
          : null
        }
        <TextInput 
          style={styles.titleInput}
          value={postTitle} 
          onChangeText={setPostTitle} 
          placeholderTextColor={color.grey3}
          placeholder="Title"
          multiline={false}
          maxLength={50}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
      </View>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postPrice 
          ? 
          <View style={styles.textInputLabelContainer}>
            <Text style={styles.textInputLabelText}>Price</Text>
          </View>
          : null
        }
        <View style={styles.priceInputContainer}>
          <Pressable
            onPress={() => {
              // setPickerType("currency");
              // setIsModalVisible(true);
            }}
          >
            <View style={styles.currencyTag}>
              <Text style={styles.currencyText}>
                {/*{chevronDown(RFValue(19), color.black1)}*/} $
              </Text>
            </View>
          </Pressable>
          <TextInput 
            style={styles.priceInput}
            value={postPrice}
            onChangeText={setPostPrice}
            placeholderTextColor={color.grey3}
            placeholder={"Price"}
            spellCheck={false}
            multiline={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            keyboardType="numeric"
          />
        </View>
      </View>
      <InputFormBottomLine />
      <View style={styles.inputFormContainer}>
        { postETC 
          ? 
          <View style={styles.textInputLabelContainer}>
            <View style={styles.textInputLabelInner}>
              <View style={styles.textInputLabelInnerIcon}>
                <AntDesign name="clockcircleo" size={RFValue(11)} color={color.black1} />
              </View>
              <Text style={styles.textInputLabelText}>Time</Text>
            </View>
          </View>
          : null
        }
        <TouchableOpacity
          onPress={() => {
            setPickerType("time");
            setIsModalVisible(true);
            setPostETC(null);
          }}
        >
          <View>
            {
              postETC
              ?
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>{convertEtcToHourMin(postETC)}</Text>
              </View>
              :
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputText}>Choose Time</Text>
              </View>
            }
          </View>
        </TouchableOpacity>
      </View>
      <InputFormBottomLine />
      <View style={styles.pickTechLabelContainer}>
        <Text style={styles.pickTechLabelText}>
          Pick the best technicians for the service
        </Text>
      </View>

      <View style={styles.pickTechContainerOuter}>
      {
        currentTechs.length > 0
        ?
        <View style={styles.pickTechContainer}>
          { 
            clickedAll
            ?
            <TouchableHighlight 
              onPress={() => {
                setSelectedTechs([]);
                setClickedAll(!clickedAll);
              }}
              style={styles.pickAllTechs}
              underlayColor={color.grey4}
            >
              <View>
                <AntDesign name="check" size={RFValue(27)} color={color.black1} />
              </View>
            </TouchableHighlight>
            :
            <TouchableHighlight 
              onPress={() => {
                let i;
                let currentTechsId = [];
                for (i = 0; i < currentTechs.length; i++) {
                  currentTechsId.push(currentTechs[i].techId);
                }
                setSelectedTechs(currentTechsId);
                setClickedAll(!clickedAll);
              }}
              style={styles.pickAllTechs}
              underlayColor={color.grey4}
            >
              <View>
                <Text style={styles.pickAllText}>
                  ALL
                </Text>
              </View>
            </TouchableHighlight>
          }
          
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={currentTechs}
            keyExtractor={(tech, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity 
                  onPress={() => {
                    console.log(item.techId);
                    if (selectedTechs.includes(item.techId)) {
                      setSelectedTechs([
                        ...selectedTechs.filter((techId) => techId !== item.techId)
                      ])
                    } else {
                      setSelectedTechs([...selectedTechs, item.techId]);
                    }
                  }}
                  style={styles.techContainer}
                >
                  <TechBox 
                    techId={item.techId}
                  />
                  <View>
                    <Text stlye={styles.techInfoText}>
                      {antdesignStaro(RFValue(13), color.yellow2)} {item.countRating ? (Math.round(item.totalRating/item.countRating * 10) / 10) : "-"}
                    </Text>
                  </View>
                  { 
                    selectedTechs.includes(item.techId)
                    ?
                    <View style={styles.chosenStatus}>
                      <View style={styles.chosenShadow}>
                      
                      </View>
                      <View style={styles.chosenCheck}>
                        <AntDesign name="checkcircle" size={RFValue(23)} color={color.blue1} />
                      </View>
                    </View>
                    : null
                  }
                </TouchableOpacity>
              )
            }}
          />
        </View>
        :
        <View style={styles.techDefaultContainer}>
          <Text>Technicians are not found</Text>
        </View>
      }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  infoInputFormContainer: {
    justifyContent: 'center',
  },
  labelContainer: {
    marginRight: RFValue(7),
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currencyTag: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    fontSize: RFValue(17),
  },
  priceInput: {
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(17),
  },
  labelText: {
    fontSize: RFValue(19),
  },
  picker: {
    height: RFValue(50),
    width: RFValue(177),
  },
  pickTechLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RFValue(7),
    backgroundColor: color.white2
  },
  pickTechLabelText: {
    fontSize: RFValue(13),
    color: color.black1,
    fontFamily: 'Inter_900Black'
  },
  pickTechContainer: {
    height: techBoxWidth,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: RFValue(5),
  },
  pickAllTechs: {
    width: RFValue(57),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white2,
    borderWidth: 1,
    borderColor: color.black1,
    borderRadius: 9,
    marginHorizontal: RFValue(5)
  },
  pickAllText: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    color: color.black1
  },

  pickTechContainerOuter: {
    width: '100%',
    height: techBoxWidth,
  },
  techDefaultContainer: {
    width: '100%',
    height: techBoxWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techContainer: {
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  techImage: {
    height: RFValue(57),
    width: RFValue(57),
    borderRadius: RFValue(100),
  },
  techInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  techInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(3),
  },
  techUsernameText: {
    fontSize: RFValue(15),
    color: color.black1
  },
  techInfoText: {
    fontSize: RFValue(15),
    color: color.black1
  },

  chosenStatus: {
    flex: 1, 
    height: techBoxWidth, 
    width: techBoxWidth, 
    position: 'absolute', 
  },
  chosenShadow: {
    flex: 1, 
    height: techBoxWidth, 
    width: techBoxWidth, 
    position: 'absolute', 
    backgroundColor: color.black1, 
    opacity: 0.1 
  },
   chosenCheck: {
    flex: 1, 
    position: 'absolute', 
    height: techBoxWidth, 
    width: techBoxWidth, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  // Title
  inputFormContainer: {
    height: RFValue(67),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputLabelContainer: {
    minHeight: RFValue(25),
  },
  textInputLabelInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputLabelInnerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  textInputLabelText: {
    fontSize: RFValue(13),
    color: color.grey3,
  },
  titleInput: {
    fontSize: RFValue(17),
    paddingHorizontal: 10,
  },

  // Time Input
  timeInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInputText: {
    fontSize: RFValue(17),
  },
});

export default DisplayPostInfoInputForm;