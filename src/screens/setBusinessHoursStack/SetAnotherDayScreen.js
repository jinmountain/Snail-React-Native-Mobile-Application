import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  ScrollView,
  SafeAreaView,
  Text, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Switch
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import MainTemplate from '../../components/MainTemplate';
import HeaderBottomLine from '../../components/HeaderBottomLine';
import { HeaderForm } from '../../components/HeaderForm';
import LoadingAlert from '../../components/LoadingAlert';

// Designs
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Hooks
import { getCalendarDates } from '../../hooks/getCalendarDates';
import {
  convertToMonthInMs,
  convertToTime,
  getDayMonthDateYear,
  moveMonthInMs,
  convertToMonthly
} from '../../hooks/useConvertTime';
// Calendar
import MonthCalendar from '../../components/businessSchedule/MonthCalendar';

// firebase
import {
  postBusSpecialDateFire,
  postTechSpecialDateFire
} from '../../firebase/business/businessPostFire';

// color
import color from '../../color';

// icon
import {
  evilIconsClose,
} from '../../expoIcons';

const SetAnotherDayScreen = ({ navigation, route }) => {
  const {
    userType,
    techId,
    busId,
  } = route.params;

  // calendar 
  const [ calendarDate, setCalendarDate ] = useState(convertToMonthInMs(Date.now()));
  const [ calendarMove, setCalendarMove ] = useState(0);
  const [ dateNow, setDateNow ] = useState(Date.now());
  const [ endTime, setEndTime ] = useState(17);
  const [ datesOnCalendar, setDatesOnCalendar ] = useState([]);

  // speical date and status 
  const [ specialDate, setSpecialDate ] = useState(null);
  const [ specialDateStatus, setSpecialDateStatus ] = useState(false);
  
  // loading screen state
  const [ showLoadingAlert, setShowLoadingAlert ] = useState(false);

  // get calendar dates
  getCalendarDates(calendarDate, dateNow, endTime, setDatesOnCalendar);

  useEffect(() => {
    return () => {
      setShowLoadingAlert(false);
    }
  }, []);

  const [ timezone, setTimezone ] = useState(null);
  const [ timezoneOffset, setTimezoneOffset ] = useState(null);

  useEffect(() => {
    const date = new Date();
    const split = date.toString().split(" ");
    const timezoneFormatted = Intl.DateTimeFormat().resolvedOptions().timeZone + " " + split[split.length - 2] + " " + split[split.length - 1];

    const diff = date.getTimezoneOffset();

    setTimezone(timezoneFormatted);
    setTimezoneOffset(diff)
  }, [specialDateStatus]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBarContainer}>
        <SafeAreaView/>
        <HeaderForm 
          leftButtonTitle={null}
          leftButtonIcon={evilIconsClose(RFValue(27), color.black1)}
          headerTitle={"Speical Date"} 
          rightButtonIcon={"Save"} 
          leftButtonPress={() => {
            navigation.goBack();
          }}
          rightButtonPress={() => {
            if (specialDate) {
              const specialDateTime = convertToTime(specialDate);
              const year = specialDateTime.year;
              const monthIndex = specialDateTime.monthIndex;
              const date = specialDateTime.date;
              if (userType === 'bus') {
                // save on firestore and get doc id
                setShowLoadingAlert(true);

                const postBusSpecialDate = postBusSpecialDateFire(
                  busId, 
                  timezoneOffset,
                  specialDate,
                  specialDateStatus,
                  year,
                  monthIndex,
                  date
                );

                postBusSpecialDate
                .then((posted) => {
                  setShowLoadingAlert(false);
                  // and then navigate back if posted is not null
                  if (posted) {
                    navigation.navigate("SetSpecialHours", {
                      newSpecialDateId: posted.id,
                      newSpecialDateInMs: posted.date_in_ms,
                      newSpecialDateStatus: posted.status,
                      newSpecialYear: posted.year,
                      newSpecialMonthIndex: posted.monthIndex,
                      newSpecialDate: posted.date,
                      userType: userType,
                      busId: busId
                    });
                  } else {
                    navigation.navigate("SetSpecialHours", {
                      userType: userType,
                      busId: busId
                    });
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              }

              if (userType === 'tech') {
                setShowLoadingAlert(true);

                const postTechSpecialDate = postTechSpecialDateFire(
                  busId, 
                  techId, 
                  timezoneOffset,
                  specialDate, 
                  specialDateStatus,
                  year,
                  monthIndex,
                  date
                );

                postTechSpecialDate
                .then((posted) => {
                  setShowLoadingAlert(false);
                  // and then navigate back if posted is not null
                  if (posted) {
                    navigation.navigate("SetSpecialHours", {
                      newSpecialDateId: posted.id,
                      newSpecialDateInMs: posted.date_in_ms,
                      newSpecialDateStatus: posted.status,
                      newSpecialYear: posted.year,
                      newSpecialMonthIndex: posted.monthIndex,
                      newSpecialDate: posted.date,
                      userType: userType,
                      busId: busId,
                      techId: techId
                    });
                  } else {
                    navigation.navigate("SetSpecialHours", {
                      userType: userType,
                      busId: busId,
                      techId: techId
                    });
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              }
            }
          }}
        />
      </View>
      <View style={styles.calendarContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles. labelText}> Select Date and Status</Text>
        </View>
        <HeaderBottomLine />
        <View style={styles.openCloseSettingContainer}>
          <View style={styles.speicalDateContainer}>
            <Text style={styles.specialDateText}>
              { specialDate
                ?
                `Date: ${getDayMonthDateYear(specialDate)}`
                : 
                "Date: (choose a date using the calendar below)"
              }
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: color.grey8, true: color.red2 }}
              thumbColor={specialDateStatus ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setSpecialDateStatus}
              value={specialDateStatus}
            />
            <View style={styles.onOffStatusConatiner}>
              { specialDateStatus === false
                ? <Text style={[styles.onOffText, { color: color.grey8 }]}>Closed</Text>
                : <Text style={[styles.onOffText, { color: color.red2 }]}>Open</Text>
              }
            </View>
          </View>
        </View>
        <HeaderBottomLine />
        <View style={styles.timezoneSetting}>
          <Text style={styles.timezoneLabelText}>Timezone:</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
          > 
            <Text style={styles.timezoneText}>{timezone} {timezoneOffset}</Text> 
          </ScrollView>
        </View>
        <View style={styles.controllerContainer}>
          <View style={styles.topControllerContainer}>
            <View style={styles.topControllerLeftCompartment}>
              {
                // new calendar date => moveMonthInMs(calendarDate, -1)
                // dateNow's month in miliseconds => convertToMonthInMs(dateNow)
                convertToMonthInMs(dateNow) <= moveMonthInMs(calendarDate, -1)
                ?
                <TouchableOpacity
                  onPress={() => {
                    setCalendarDate(moveMonthInMs(calendarDate, -1));
                    setCalendarMove(calendarMove - 1);
                  }}
                >
                  <AntDesign name="leftcircleo" size={RFValue(27)} color="black" />
                </TouchableOpacity>
                :
                <View>
                  <AntDesign name="leftcircleo" size={RFValue(27)} color={color.grey1} />
                </View>
              }
            </View>
            <View style={styles.calendarControllerCenterCompartment}>
              <TouchableOpacity
                onPress={() => {

                }}
              >
                <Text style={styles.calendarDateText}>
                  {convertToMonthly(calendarDate)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topControllerRightCompartment}>
              <TouchableOpacity
                onPress={() => {
                  setCalendarDate(moveMonthInMs(calendarDate, +1)),
                  setCalendarMove(calendarMove + 1)
                }}
              >
                <AntDesign name="rightcircleo" size={RFValue(27)} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <HeaderBottomLine />
        </View>
        <MonthCalendar 
          chosenDate={specialDate}
          dateNow={dateNow}
          datesOnCalendar={datesOnCalendar}
          setChosenDate={setSpecialDate}
          setCalendarMove={setCalendarMove}
          canSelectPast={false}
        />
        <View style={{height: RFValue(30)}}>
        </View>
      </View>
      {
        showLoadingAlert &&
        <LoadingAlert />
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
  calendarContainer: {
    flex: 1,
    backgroundColor: color.white2
  },

  // Controller
  controllerContainer: {
    backgroundColor: color.white2,
  },
  topControllerContainer: {
    paddingVertical: RFValue(7),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  calendarControllerCenterCompartment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControllerLeftCompartment: {
    paddingLeft: RFValue(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControllerRightCompartment: {
    paddingRight: RFValue(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDateText: {
    fontSize: RFValue(19)
  },

  openCloseSettingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: RFValue(5),
  },
  onOffStatusConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },
  onOffText: {
    fontWeight: 'bold',
    fontSize: RFValue(13),
  },

  speicalDateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: RFValue(9),
  },
  specialDateText: {
    fontSize: RFValue(19)
  },

  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: RFValue(15),
    paddingVertical: RFValue(15),
  },
  labelText: {
    fontSize: RFValue(19),
    fontWeight: 'bold'
  },

  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(3),
  },

  timezoneSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: RFValue(9),
    height: RFValue(57)
  },
  timezoneLabelText: {
    fontSize: RFValue(19),
    fontWeight: 'bold',
    color: color.black1
  },
  timezoneText: {
    justifyContent: 'center',
    paddingLeft: RFValue(9),
    color: color.black1,
    fontSize: RFValue(13)
  },
});

export default SetAnotherDayScreen;