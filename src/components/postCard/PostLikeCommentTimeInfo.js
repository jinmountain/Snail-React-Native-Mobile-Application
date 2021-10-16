import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
} from 'react-native';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Hooks
import { timeDifference } from '../../hooks/timeDifference';
import { kOrNo } from '../../hooks/kOrNo';

const likeOrLikes = (likeCount) => {
  if (likeCount === 1) {
    return "like"
  }
  else if (likeCount > 1) {
    return "likes"
  }
  else {
    return "like"
  }
};

const PostLikeCommentTimeInfo = ({likeCount, commentCount, postTimestamp}) => {
  return (
    <View style={styles.additionalTextContainer}>
      <View style={styles.likeCommentContainer}>
        <View style={styles.likesContainer}>
          <Text style={styles.likesText}>
            {kOrNo(likeCount)} {likeOrLikes(likeCount)}
          </Text>
        </View>
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsText}>0 comment</Text>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {timeDifference(Date.now(), postTimestamp)}
        </Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  additionalTextContainer: {
    overflow: "hidden",
    justifyContent: 'center',
  },

  // Like and comment
  likeCommentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  likesContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  likesText: {
    color: '#5A646A',
    fontSize: RFValue(13),
  },
  commentsContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  commentsText: {
    color: '#5A646A',
    fontSize: RFValue(13), 
  },

  timeContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  timeText: {
    color: "#5A646A",
    fontSize: RFValue(13),
  },
});

export default PostLikeCommentTimeInfo;