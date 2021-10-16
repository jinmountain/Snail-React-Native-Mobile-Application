import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
// import { Feather } from '@expo/vector-icons';

// Hooks
import { colorByRating } from '../hooks/colorByRating';

// Color
import color from '../color';

const TagLine = ({ tags }) => {
  return (
    <View style={styles.tagBoxContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tags}
        keyExtractor={(tag, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity 
              onPress={() => {
              }}
            >
              <View style={styles.unitContainer}>
                <View style={styles.tagsContainer}>
                  <Text style={styles.tagText}>
                    {item}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Tags
  tagBoxContainer: {
    justifyContent: 'center',
    marginVertical: RFValue(1),
  },
  unitContainer: {
    borderWidth: 0.5,
    borderRadius: RFValue(8),
    marginRight: RFValue(5),
    paddingVertical: RFValue(3),
    paddingHorizontal: RFValue(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  tagText: {
    fontSize: RFValue(17),
  },
});

export default TagLine;