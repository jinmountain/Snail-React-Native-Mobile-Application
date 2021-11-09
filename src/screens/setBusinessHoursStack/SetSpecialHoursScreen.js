// developer summary
// ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// this screen is for a business to change its business hours.
// if they make any change and click save a two button alert 
// will pop and ask again to confirm.

import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView, 
  Text,
  Switch,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import TwoButtonAlert from '../../components/TwoButtonAlert';

// Design
import { FontAwesome } from '@expo/vector-icons';

// firebase
import businessUpdateFire from '../../firebase/businessUpdateFire';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import useConvertTime from '../../hooks/useConvertTime';

// color
import color from '../../color';

// icon
import expoIcons from '../../expoIcons';

const SpecialHoursContainer = ({ navigation, dateInMs, status, index, hours, setHours }) => {
  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingTopContainer}>
        <View style={styles.dayContainer}>
          <View style={styles.specialDayIconContainer}>
            <FontAwesome name="calendar-o" size={RFValue(23)} color={color.black1} />
          </View>
          <View style={styles.specialDateTextContainer}>
            <Text style={styles.specialDateText}>{useConvertTime.getDayMonthDateYear(dateInMs)}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusTextContainer}>
            { status === false
              ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
              : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
            }
          </View>
        </View>
      </View>
      {
        status &&
        <View style={styles.settingBottomContainer}>
          {
            // newHours: {
            //  opens: {
            //    hour: militaryStartHour,
            //    min: startMin
            //  },
            //  closes: {
            //    hour: militaryEndHour,
            //    min:  endMin
            //  }
            // }
            hours.map(( item, index ) => {
              return (

                  <View 
                    key={index}
                    style={styles.addNewHoursContainer}
                  >
                    <View style={styles.startContainer}>
                      <View style={styles.timeLabelContainer}>
                        <Text style={styles.timelabelText}>
                          Opens
                        </Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {useConvertTime.convertMilitaryToStandard(item.opens.hour, item.opens.min)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.crossContainer}>
                      <View 
                        style={[styles.cross, { transform: [{ rotate: "-25deg" }], marginTop: RFValue(1.5) }]} 
                      />
                      <View
                        style={[styles.cross, { transform: [{ rotate: "25deg" }], marginTop: RFValue(26.5) }]}
                      />
                    </View>
                    <View style={styles.endContainer}>
                      <View style={styles.timeLabelContainer}>
                        <Text style={styles.timelabelText}>
                          Closes
                        </Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {useConvertTime.convertMilitaryToStandard(item.closes.hour, item.closes.min)}
                        </Text>
                      </View>
                    </View>
                    <TouchableHighlight
                      style={styles.deleteHoursButton}
                      onPress={() => {
                        console.log('delete');
                        setHours([ ...hours.filter((hour) => hour !== item ) ]) 
                      }}
                      underlayColor={color.grey4}
                    >
                      <View style={styles.addButtonTextContainer}>
                        <Text style={styles.addButtonText}>{expoIcons.antClose(RFValue(23), color.black1)}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
              )
            })
          }
          <TouchableHighlight
            style={styles.addOpenHoursButtonContainer}
            onPress={() => {
              navigation.navigate("UBSetHours", {
                dayType: dayType
              })
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addOpenHoursButtonInner}>
              <View style={styles.addOpenHoursIconContainer}>
                {expoIcons.featherPlus(RFValue(19), color.red2)}
              </View>
              <View style={styles.addOpenHoursTextContainer}>
                <Text style={styles.addOpenHoursText}>Add open hours</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      }
    </View>
  )
}

const UBSetSpecialHoursScreen = ({ route, navigation }) => {
  const { 
    state: {
      user
    }
  } = useContext(AuthContext);
  
  const [ showTba, setShowTba ] = useState(false);

  const [ currentSpecialHours, setCurrentSpecialHours ] = useState(user.special_hours ? user.special_hours : null); // business user's business hours
  // spcialHours structure
  // [
  //   speical day
  //   {
  //      date_in_ms: number,
  //      status: boolean,
  //      hours: array
  //   } 

  //   hours example below
  //   [ 
  //     {
  //       opens: {
  //         hour: militaryStartHour,
  //         min: startMin
  //       },
  //       closes: {
  //         hour: militaryEndHour,
  //         min:  endMin
  //       }
  //     }
  //   ]
  // ]

  // seperated into three for date_in_ms, status, and hours
  const [ speicalDates, setSpecialDate ] = useState([]);
  const [ speicalDatesStatus, setSpeicalDatesStatus ] = useState([]);
  const [ specialHours, setSpecialHours ] = useState([]);

  const [ readyToSave, setReadyToSave ] = useState(false);

  const { 

  } = route.params;

  useEffect(() => {
    
  }, []);

  return (
    <MainTemplate>
      <View style={styles.mainContainer}>
        <HeaderForm 
          leftButtonTitle={"Cancel"}
          leftButtonIcon={null}
          headerTitle={"Special Hours"} 
          rightButtonTitle={"Save"} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            
          }}
        />
        <View style={styles.speicalDayHoursContainer}>
          <FlatList 
            onEndReached={() => {
          
            }}
            onEndReachedThreshold={0.01}
            vertical
            showsVerticalScrollIndicator={false}
            data={specialHours}
            keyExtractor={(hour, index ) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <SpecialHoursContainer 
                  navigation={navigation}
                  dateInMs={item.date_in_ms}
                  status={item.status}
                  index={index}
                  hours={item.hours}
                  setHours={setSpeicalHours}
                />
              )
            }}
          />
        </View>
        <View style={styles.addAnotherDayContainer}>
          <TouchableHighlight
            style={styles.addAnotherDayButton}
            onPress={() => {
              navigation.navigate("SetAnotherDay");
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addAnotherDayTextContainer}>
              <Text style={styles.addAnotherDayText}>
                Add Another Day
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      { showTba && 
        <TwoButtonAlert 
          title={"Ready to Save?"}
          message={
            "Please, make sure all the hours are correct."
          }
          buttonOneText={"Save"}
          buttonTwoText={"No"} 
          buttonOneAction={() => {
            console.log("save");
          }} 
          buttonTwoAction={() => {
            setShowTba(false);
          }}
        />
      }
    </MainTemplate>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  settingContainer: {
    backgroundColor: color.white2,
  },
  settingTopContainer: {
    flexDirection: 'row',
    height: RFValue(57),
  },
  settingBottomContainer: {
    backgroundColor: color.white2,
  },

  dayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  specialDayIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(50),
  },
  specialDateTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  specialDateText: {
    fontSize: RFValue(19),
    fontWeight: 'bold'
  },

  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: RFValue(7),
  },
  onOffStatusConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(7),
  },
  onOffText: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },

  addOpenHoursButtonContainer: {
    height: RFValue(57),
    justifyContent: 'center',
    paddingLeft: RFValue(50)
  },
  addOpenHoursButtonInner: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  addOpenHoursIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOpenHoursTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOpenHoursText: {
    fontSize: RFValue(19),
    color: color.red2
  },

  addNewHoursContainer: {
    height: RFValue(57),
    alignItems: 'center',
    paddingLeft: RFValue(50),
    flexDirection: 'row',
  },
  startContainer: {
    flex: 1,
  },
  endContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabelContainer: {
    justifyContent: 'center'
  },
  timeLabelText: {
    fontSize: RFValue(17)
  },
  timeText: {
    fontSize: RFValue(19)
  },

  deleteHoursButton: {
    height: RFValue(57),
    width: RFValue(57),
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    fontSize: RFValue(17)
  },

  setHoursContainer: {
    position: 'absolute'
  },
  crossContainer: {
    width: RFValue(57),
    height: RFValue(57),
    alignItems: "center",
  },
  cross: {
    position: 'absolute',
    width: RFValue(1),
    height: RFValue(28.5),
    backgroundColor: color.black1,
  },

  speicalDayHoursContainer: {
    flex: 1
  },
});

export default UBSetSpecialHoursScreen;