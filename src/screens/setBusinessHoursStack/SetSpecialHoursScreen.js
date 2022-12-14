// developer summary
// ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// when delete date, it will delete the doc
// newly added special dates will be added to firebase when saved

import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView, 
  Text,
  Switch,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import TwoButtonAlert from '../../components/TwoButtonAlert';
import AlertBoxTop from '../../components/AlertBoxTop';
import SpinnerFromActivityIndicator from '../../components/ActivityIndicator';

// Design
import { FontAwesome } from '@expo/vector-icons';

// firebase
import {
  updateBusSpecialHoursDocHours,
  updateTechSpecialHoursDocHours
} from '../../firebase/business/businessUpdateFire';
import {
  getBusUpcomingSpecialHours,
} from '../../firebase/business/businessGetFire';
import businessDeleteFire from '../../firebase/business/businessDeleteFire';

// Context
import { Context as AuthContext } from '../../context/AuthContext';

// Hooks
import {
  getDayMonthDateYearFromDate,
  convertMilitaryToStandard
} from '../../hooks/useConvertTime';
import { isCloseToBottom } from '../../hooks/isCloseToBottom';

// color
import color from '../../color';

// icon
import {
  fontAwesomeCalendarO,
  antClose,
  featherPlus,
  evilIconsClose,
  fontAwesomeCalendarPlusO
} from '../../expoIcons';

const SetSpecialHoursScreen = ({ route, navigation }) => {
  const { 
    state: {
      user
    }
  } = useContext(AuthContext);

  const { 
    userType,
    // from SetAnotherDayScreen
    newSpecialDateId,
    newSpecialDateInMs,
    newSpecialDateStatus,
    newSpecialYear,
    newSpecialMonthIndex,
    newSpecialDate,
    // from SetHoursScreen
    newHours,
    specialDateIndex,
    // for tech
    techId,
  } = route.params;
  
  const [ showTba, setShowTba ] = useState(false);
  const [ alertBoxText, setAlertBoxText ] = useState('');
  const [ alertBoxStatus, setAlertBoxStatus ] = useState(false);
  // spcialHours structure
  // [
  //   special day
  //   {
  //      id: string,
  //      date: {
  //        date: number,
  //        monthIndex: number,
  //        year: number
  //      },
  //      status: boolean,
  //      hours: array,
  //      timezoneOffset: number,
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

  // special hours fetch states
  const [ specialHoursFetchSwitch, setSpecialHoursFetchSwitch ] = useState(true);
  const [ lastSpecialHour, setLastSpecialHour ] = useState(null);
  const [ getSpecialHoursState, setGetSpecialHoursState ] = useState(false);

  // business user's special hours
  const [ currentSpecialHours, setCurrentSpecialHours ] = useState([]);
  // seperated into three for date_in_ms, status, and hours
  const [ specialDates, setSpecialDates ] = useState([]);

  // if userType is tech
  useEffect(() => {
    let isMounted = true;
    let getSpecialHours;

    if (userType === 'bus' && user.id) {
      isMounted && setGetSpecialHoursState(true);
      getSpecialHours = getBusUpcomingSpecialHours(user.id, null);
    };
    
    if (userType === 'tech' && techId && user.id) {
      // get tech business hours
      isMounted && setGetSpecialHoursState(true);
      getSpecialHours = getTechUpcomingSpecialHours(user.id, techId, null);
    };

    getSpecialHours
    .then((result) => {
      // result
      // { specialHours: specialHours, lastSpecialHour: lastVisible, fetchSwitch: true }
      if (isMounted) {
        console.log("result: ", result.specialHours);
        setSpecialDates(result.specialHours);
        setGetSpecialHoursState(false);
        setLastSpecialHour(result.lastSpecialHour);
        setSpecialHoursFetchSwitch(result.fetchSwitch);
      }
    })
    .catch((error) => {
      console.log("error: ", error);
    });

    return () => {
      isMounted = false;
      // navigation.setParams({ 
      //   userType: null, 
      // });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (newSpecialDateId) {
      isMounted && setSpecialDates([ 
        ...specialDates, 
        { 
          id: newSpecialDateId,
          date_in_ms: newSpecialDateInMs, 
          status: newSpecialDateStatus, 
          hours: [],
          year: newSpecialYear,
          monthIndex: newSpecialMonthIndex,
          date: newSpecialDate
        } 
      ]);
      // navigation.setParams({
      //   newSpecialDateId: null,
      //   newSpecialDateInMs: null, 
      //   newSpecialDate: null, 
      //   newSpecialDateStatus: null, 
      // });
    };

    if (newHours) {
      let newSpecialDate = specialDates[specialDateIndex];
      let newSpecialDateHours = [ ...newSpecialDate.hours, newHours ];
      newSpecialDate.hours = newSpecialDateHours;

      console.log(newSpecialDate);

      const specialDatesLen = specialDates.length;
      // only one
      if (specialDatesLen === 1) {
        isMounted && setSpecialDates([newSpecialDate]);
      }
      // more than one
      if (specialDatesLen > 1) {
        isMounted && setSpecialDates([
          ...specialDates.slice(0, specialDateIndex),
          newSpecialDate,
          ...specialDates.slice(specialDateIndex + 1, specialDatesLen)
        ]);
      }

      navigation.setParams({ 
        newHours: null, 
        specialDateIndex: null, 
      });
    }

    return () => {
      isMounted = false;
      setShowTba(false);
    }
  }, [ newSpecialDateId, newHours ]);

  const RenderSpecialDayItem = ({ item, index }) => {
    const [ sp, setSp ] = useState(item);
    const [ spHours, setSpHours ] = useState(item.hours);
    return (
      sp && sp.date
      ?
      <View style={styles.settingContainer}>
        {
          index > 1 &&
          <HeaderBottomLine />
        }
        <View style={styles.settingTopContainer}>
          <View style={styles.dayContainer}>
            <View style={styles.specialDayIconContainer}>
              {fontAwesomeCalendarO(RFValue(23), color.black1)}
            </View>
            <View style={styles.specialDateTextContainer}>
              <Text style={styles.specialDateText}>{getDayMonthDateYearFromDate(sp.year, sp.monthIndex, sp.date)}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusTextContainer}>
              { sp.status === false
                ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
                : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
              }
            </View>
          </View>
          <TouchableHighlight
            style={styles.deleteHoursButton}
            onPress={() => {
              console.log('delete');
              let deleteSpecialHours;
              if (userType === 'bus') {
                deleteSpecialHours = businessDeleteFire.deleteBusSpecialHoursDoc(user.id, sp.id);
              };

              if (userType === 'tech') {
                deleteSpecialHours = businessDeleteFire.deleteTechSpecialHoursDoc(user.id, techId, sp.id);
              };

              setSp(null);
            }}
            underlayColor={color.grey4}
          >
            <View style={styles.addButtonTextContainer}>
              <Text style={styles.addButtonText}>
                <FontAwesome name="calendar-minus-o" size={RFValue(23)} color={color.black1} />
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        {
          spHours
          ?
          <View style={styles.settingBottomContainer}>
            <FlatList
              data={spHours}
              renderItem={({item, index}) => {
                return (
                  <View 
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
                          {convertMilitaryToStandard(item.opens.hour, item.opens.min)}
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
                          {convertMilitaryToStandard(item.closes.hour, item.closes.min)}
                        </Text>
                      </View>
                    </View>
                    <TouchableHighlight
                      style={styles.deleteHoursButton}
                      onPress={() => {
                        const specialDatesLen = specialDates.length;
                        console.log('delete');

                        const newHours = spHours.filter((hour) => hour !== item);

                        // named "update" not "delete" because it updates doc's "hours" attribute to "newHours"
                        let updateSpecialHoursDocHours;
                        if (userType === "bus") {
                          updateSpecialHoursDocHours = updateBusSpecialHoursDocHours(user.id, sp.id, newHours);
                        };
                        if (userType === "tech") {
                          updateSpecialHoursDocHours = updateTechSpecialHoursDocHours(user.id, techId, sp.id, newHours);
                        };

                        // make the change to firestore doc 
                        updateSpecialHoursDocHours
                        .then(() => {
                          console.log("done");
                          // and then change the hours
                          // let newSpecialDate = sp 
                          // newSpecialDate.hours = newHours;
                          // console.log(newSpecialDate);
                          setSpHours(newHours);

                          // console.log("newSpecialDate: ", newSpecialDate);

                          // // only one
                          // if (specialDatesLen === 1) {
                          //   setDates([newSpecialDate]);
                          // };
                          // // more than one
                          // if (specialDatesLen > 1) {
                          //   setDates([
                          //     ...specialDates.slice(0, index),
                          //     newSpecialDate,
                          //     ...specialDates.slice(index + 1, specialDatesLen)
                          //   ]);
                          // };
                        });
                      }}
                      underlayColor={color.grey4}
                    >
                      <View style={styles.addButtonTextContainer}>
                        <Text style={styles.addButtonText}>{antClose(RFValue(23), color.black1)}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableHighlight
              style={styles.addOpenHoursButtonContainer}
              onPress={() => {
                navigation.navigate("SetHours", {
                  hoursType: 'special',
                  specialDateIndex: index,
                  userType: userType,
                  techId: techId,
                  busId: user.id,
                  docId: sp.id,
                  currentHours: spHours
                })
              }}
              underlayColor={color.grey4}
            >
              <View style={styles.addOpenHoursTextContainer}>
                <Text style={styles.addOpenHoursText}>
                  {featherPlus(RFValue(19), color.red2)} Add open hours
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          : null
        }
      </View>
      : null
    )
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBarContainer}>
        <SafeAreaView/>
        <HeaderForm 
          leftButtonIcon={evilIconsClose(RFValue(27), color.black1)}
          headerTitle={"Special Hours"} 
          rightButtonIcon={"Done"} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            navigation.goBack();
          }}
        />
      </View>

      <View style={styles.specialDayHoursContainer}>
        {/*existing and new special dates*/}
        <FlatList
          onEndReached={() => {
            if (specialHoursFetchSwitch && !getSpecialHoursState) {
              setGetSpecialHoursState(true);
              let getSpecialHours;
              if (userType === 'bus' && user.id) {
                getSpecialHours = getBusUpcomingSpecialHours(user.id, lastSpecialHour);
              };
              if (userType === 'tech' && techId && user.id) {
                // get tech business hours
                getSpecialHours = getTechUpcomingSpecialHours(user.id, techId, lastSpecialHour);
              };
              getSpecialHours
              .then((result) => {
                // result
                // { specialHours: specialHours, lastSpecialHour: lastVisible, fetchSwitch: true }
                setGetSpecialHoursState(false);
                setSpecialDates([...specialDates, ...result.specialHours]);
                setLastSpecialHour(result.lastSpecialHour);
                setSpecialHoursFetchSwitch(result.fetchSwitch);
              })
              .catch((error) => {
                console.log("error: ", error);
              });
            }
          }}
          data={specialDates}
          renderItem={({item, index}) => 
            <RenderSpecialDayItem 
              item={item}
              index={index}
            />
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.id}
        />
        {/*upcoming holidays*/}
        { getSpecialHoursState &&
          <View style={styles.loadingContainer}>
            <SpinnerFromActivityIndicator containerCustomStyle={{ height: RFValue(57) }}/>
          </View>
        }
      </View>
      <View style={styles.addAnotherDayContainer}>
        <HeaderBottomLine />
        <TouchableHighlight
          style={styles.addAnotherDayButton}
          onPress={() => {
            navigation.navigate("SetAnotherDay", {
              userType: userType,
              techId: techId,
              busId: user.id
            });
          }}
          underlayColor={color.grey4}
        >
          <View style={styles.addAnotherDayTextContainer}>
            <Text style={styles.addAnotherDayText}>
              {fontAwesomeCalendarPlusO(RFValue(23), color.black1)} Add Another Day
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    
      {/*{ showTba && 
        <TwoButtonAlert 
          title={"Ready to Save?"}
          message={
            "Please, make sure all the hours are correct."
          }
          buttonOneText={"Save"}
          buttonTwoText={"No"} 
          buttonOneAction={() => {
            if (userType === 'tech') {
              const updateTechSpecialHours = updateTechSpecialHours(user.id, techId, specialDates);
              updateTechSpecialHours
              .then(() => {
                setCurrentSpecialHours(specialDates);
                setShowTba(false);
              })
              .catch((error) => {
                console.log("error: setCurrentSpecialHours: ", error);
              });
            }

            if (userType === 'bus') {

            }
          }} 
          buttonTwoAction={() => {
            setShowTba(false);
          }}
        />
      }*/}
      {
        alertBoxStatus &&
        <AlertBoxTop
          alertText={alertBoxText}
          setAlert={setAlertBoxStatus}
        />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  headerBarContainer: { 
    backgroundColor: color.white2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // for android
    elevation: 5,
    // for ios
    zIndex: 5
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
  addOpenHoursTextContainer: {
    justifyContent: 'center',
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

  specialDayHoursContainer: {
    flex: 1,
  },

  addAnotherDayContainer: {
    height: RFValue(59),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  addAnotherDayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: RFValue(57),
    width: '100%'
  },
  addAnotherDayTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAnotherDayText: {
    fontSize: RFValue(19)
  },

  loadingContainer: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 100
  },
});

export default SetSpecialHoursScreen;