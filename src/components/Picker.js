import React from 'react';
import {
  View,
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableHighlight,
} from "react-native";
// TouchableOpacity from rngh works on both ios and android
// import { TouchableOpacity } from 'react-native-gesture-handler';

// npms
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components

// Designs

// Hooks

// Color
import color from '../color';

// expo icons
import expoIcons from '../expoIcons';

const VerticalScrollPicker = ({ content, setValue, setIsModalVisible, defaultLabel, defaultValue }) => {
  const VerticalScrollModalButton = ({ label, value, setValue, setIsModalVisible }) => {
    return (
      <TouchableHighlight
        style={{ height: RFValue(53), justifyContent: 'center', alignItems: 'center' }}
        onPress={() => {
          setValue(value);
          setIsModalVisible(false);
        }}
        underlayColor={color.grey4}
      >
        <View 
          style={{ justifyContent: 'center', alignItems: 'center', width: "100%" }}
        >
          <Text style={{ fontSize: RFValue(17) }}>{label}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  return (
    <ScrollView>
      {
        defaultValue &&
        <TouchableHighlight
          key={"default"}
          style={{ height: RFValue(53), justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            setValue(defaultValue);
            setIsModalVisible(false);
          }}
          underlayColor={color.grey4}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%", flexDirection: 'row'}}>
            <View style={styles.modalCloseContainer}>
              {expoIcons.chevronBack(RFValue(27), color.black1)}
            </View>
            <View>
              <Text style={{ fontSize: RFValue(17) }}>{defaultLabel}</Text>
            </View>
          </View>
        </TouchableHighlight>
      }
      {
        content.map((item, index) => (
          <VerticalScrollModalButton
            key={index}
            label={item.label}
            value={item.value}
            setValue={setValue}
            setIsModalVisible={setIsModalVisible}
          />
        ))
      }
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  
});

export default VerticalScrollPicker