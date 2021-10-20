import React from 'react';
import { 
	View, 
	StyleSheet,
	Text,  
	Dimensions
} from 'react-native';

// NPMs
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Color
import color from '../../color';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DisplayPostInfo = ({ containerWidth, title, taggedCount, likeCount, etc, price }) => {
	return (
		<View style={{ ...styles.displayPostInfoContainer, ...{ width: containerWidth } }}>
			<View style={styles.infoTop}>
				<Text style={styles.infoText} numberOfLines={1}>
					{title}
				</Text>
			</View>
			<View style={styles.infoBottom}>
				<View style={styles.infoContainer}>
					<AntDesign name="hearto" size={RFValue(11)} color={color.ratingRed} />
					<Text style={styles.infoText} numberOfLines={1}>
						{likeCount}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					<Text style={styles.infoText} numberOfLines={1}>
						${price}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
			  	<AntDesign name="clockcircleo" size={RFValue(11)} color={color.black1} />
			  	<Text style={styles.infoText} numberOfLines={1}>
						{etc}
			  	</Text>
				</View>
				<View style={styles.infoContainer}>
					<AntDesign name="staro" size={RFValue(11)} color={color.black1} />
					<Text style={styles.infoText} numberOfLines={1}>
						{taggedCount}
			  	</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({ 
	displayPostInfoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 2,
		backgroundColor: color.white1,
		paddingVertical: RFValue(3),
	},
	infoContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
	},
	infoTop: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white2,
		borderRadius: RFValue(7)
	},
	infoBottom: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: color.white2,
		borderRadius: RFValue(7)
	},
	infoText: {
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: RFValue(3),
		fontSize: RFValue(15)
	},
});

export default DisplayPostInfo;
