import Firebase from '../firebase/config'
import firebase from 'firebase/app';
import { navigate } from '../navigationRef';
import * as geofirestore from 'geofirestore';

// GoogleAPI
// import geocoding from '../googleAPI/geocoding';

// Firebase
import authFire from './authFire';
// const uid = () => {
// 	return (Firebase.auth().currentUser || {}).uid
// };

const rootRef = Firebase.firestore();
const usersRef = Firebase.firestore().collection('users');

// count increment and decrement
const countIncrementByOne = firebase.firestore.FieldValue.increment(1);
const countDecrementByOne = firebase.firestore.FieldValue.increment(-1);

const businessUpdateLocation = (newLocation, userLocality, userService) => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			// Create a Firestore reference
			const firestore = firebase.firestore();
			// Create a GeoFirestore reference
			const GeoFirestore = geofirestore.initializeApp(firestore);
			const lat = newLocation.geometry.location.lat;
			const lng = newLocation.geometry.location.lng;

			const serviceLen = userService.length;

			let newBusinessData
			if (newLocation.locationType === "inStore") {
				// Local Snail Data
				const getLocality = (address) => {
					let locality; // string
					const splitAddressArr = address.split(", ");
					const splitArrLength = splitAddressArr.length;
					if (splitAddressArr[splitArrLength-1] === "USA") {
						var state = splitAddressArr[2].replace(/[0-9]/g, '').replace(/ /g, '');
						var city = splitAddressArr[1].replace(/ /g, '');
						var country = splitAddressArr[splitArrLength-1];
						locality = `${city}${state}${country}`;
					}
					return locality;
				}
				
				const locality = getLocality(newLocation.formatted_address);
				
				let googlemapsUrl;

				if (newLocation.url) {
					googlemapsUrl = newLocation.url
					delete newLocation.url
				}
				newBusinessData = { 
					...newLocation, 
					...{ 
						coordinates: new firebase.firestore.GeoPoint(lat, lng),
						googlemapsUrl: googlemapsUrl,
						locality: locality
					}
				}
				// increment the store count of the locality
				// userLocality => current locality
				// locality => new locality
				let serviceIndex;
				for (serviceIndex = 0; serviceIndex < serviceLen; serviceIndex++ ) {
					rootRef
					.collection(`${locality}StoreCount`)
					.doc(`${userService[serviceIndex]}StoreCount`)
					.set({ count: countIncrementByOne }, { merge: true });
				}

			} else {
				newBusinessData = { 
					...newLocation, 
					...{ coordinates: new firebase.firestore.GeoPoint(lat, lng) }
				}
			}

			const usersGeoRef = GeoFirestore.collection('users');
			usersGeoRef
			.doc(currentUser.uid)
			.update(newBusinessData)
			.then(() => {
				console.log("Updated business location: ", newBusinessData);
			})
			.catch((error) => {
				console.log("Error occured during updating business location: ", error);
			});

			// if there is a current locality decrement the store count of the locality
			if (userLocality) {
				if (userService) {
					let serviceIndex;
					for (serviceIndex = 0; serviceIndex < serviceLen; serviceIndex++ ) {
						rootRef
						.collection(`${userLocality}StoreCount`)
						.doc(`${userService[serviceIndex]}StoreCount`)
						.set({ count: countDecrementByOne }, { merge: true });
					}
				}
			}

			res(true);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const businessRegister = (businessServiceType) => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			usersRef
			.doc(currentUser.uid)
			.set({ type: "business", service: businessServiceType, businessRegistered: Date.now(), techs: [] }, { merge: true })
			.then(() => {
				console.log("Registered a new business user.");
				res();
			})
			.catch((error) => {
				console.log("Error occured during registering a new business user: ", error);
				rej();
			});
		})
		.catch((error) => {
			console.log(error);
		})
	});
};

const businessDeregister = () => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			// check whether the business has locality
			const getLocality = usersRef.doc(currentUser.id).get();
			getLocality
			.then((user) => {
				const userData = user.data();
				// decrement store count of the locality
				if (userData && userData.locality) {
					rootCountsRef
					.doc(`${userData.locality}StoreCount`)
					.set({ count: countDecrementByOne }, { merge: true });
				}

				// deregister business
				const deregisterBusiness = usersRef
		  	.doc(currentUser.uid)
		  	.update({ 
		  		type: "preBusiness", 
		  		businessDeregistered: Date.now(),
		  		// delete following fields
		  		coordinates: firebase.firestore.FieldValue.delete(),
		  		formatted_address: firebase.firestore.FieldValue.delete(),
		  		g: firebase.firestore.FieldValue.delete(),
		  		geometry: firebase.firestore.FieldValue.delete(),
		  		locationType: firebase.firestore.FieldValue.delete(),
		  		url: firebase.firestore.FieldValue.delete(),
		  		locality: firebase.firestore.FieldValue.delete(),
		  	});
		  	
		  	deregisterBusiness
		  	.then(() => {
		  		console.log("Deregisted a business user.");
		  		res(true);
		  	})
		  	.catch((error) => {
		  		console.log("Error occured: businessUpdateFire: businessDeregister: deregisterBusiness: ", error);
		  	});
			})
			.catch((error) => {
				console.log("Error occured: businessUpdateFire: businessDeregister: getLocality: ", error);
			})
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const technicianRegister = (userId) => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			usersRef
			.doc(currentUser.uid)
			.update({ 
				type: "technician", 
				technicianRegistered: Date.now() 
			})
			.then(() => {
				console.log("Registered a new technician user.");
				res();
			})
			.catch((error) => {
				console.log("Error occured during registering a new technician user: ", error);
				rej();
			});
		})
		.catch((error) => {
			console.log(error);
		});
	});
};

const technicianDeregister = () => {
	return new Promise ((res, rej) => {
		const authCheck = authFire.authCheck();
		authCheck
		.then((currentUser) => {
			// first change type to preBusiness
	  	usersRef
	  	.doc(currentUser.uid)
	  	.update({ type: "preTechnician", technicianDeregistered: Date.now() })
	  	.then(() => {
	  		console.log("Deregisted a technician user.");
	  		res();
	  	})
	  	.catch((error) => {
	  		console.log("Error occured during deregistering a technician user: ", error);
	  	});
		})
		.catch((error) => {
			console.log(error);
		})
	});
};

export default { businessUpdateLocation, businessRegister, businessDeregister, technicianRegister, technicianDeregister }