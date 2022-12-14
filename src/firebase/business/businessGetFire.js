import Firebase from '../../firebase/config';
import firebase from 'firebase/app';
import { navigate } from '../../navigationRef';

import {
	convertToDateInMs,
} from '../../hooks/useConvertTime';

const db = Firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
const reservationsRef = db.collection('reservations');

const getTechnicians = (
	busId, 
	techLast,
	status = "active",
	limit = 12
) => {
	return new Promise (async (res, rej) => {
		let techniciansRef;
		if (techLast) {
			techniciansRef = usersRef
			.doc(busId)
			.collection("technicians")
			.where("status", "==", status)
			.orderBy("createdAt", "desc")
			.startAfter(techLast)
			console.log("getTechnicians => startAfter");
		} else {
			techniciansRef = usersRef
			.doc(busId)
			.collection("technicians")
			.where("status", "==", status)
			.orderBy("createdAt", "desc")
		};

		techniciansRef
		.limit(limit)
		.get()
		.then(async (querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;
			const lastVisible = querySnapshot.docs[docLength - 1];

			if (docLength > 0) {
				const getTechs = querySnapshot.docs.map((doc) => {
					const docId = doc.id;
		    	const docData = doc.data();

		    	const tech = {
	    			techId: docData.techId,
	    			countRating: docData.countRating,
	    			totalRating: docData.totalRating
		    	}

					return tech;
				});

				const technicians = await Promise.all(getTechs);
				res({ techs: technicians, lastTech: lastVisible });
			} 
			else {
				res({ techs: [], lastTech: lastVisible });
			};
		})
		.catch((error) => {
			rej(error);
		});
	});
}

const getTechniciansByIds = (techs) => {
	return new Promise ( async (res, rej) => {
		let technicians = [];
		let docIndex = 0;
		const numOfTechs = techs.length;

		if (numOfTechs === 0) {
			res(technicians);
		}

		try {
			if (numOfTechs > 0) {
				let i;
				for (i = 0; i < numOfTechs; i++) {
					// get tech data
					const getTechData = await usersRef.doc(techs[i]).get();
					const techData = getTechData.data();

					// // get tech average rating
					// const getTechRatingBus = await usersRef.doc(busId).collection("technicians").doc(techs[i]).get();
					// const techRatingBus = getTechRatingBus.data();

					// // get tech rating for this post
					// const getTechRatingPost = await usersRef.doc(busId).collection("technicians").doc(techs[i]).collection("ratingsByPost").doc(postId).get();
					// const techRatingPost = getTechRatingPost.data();

					const tech = {
		    		techData: {
		    			id: techData.id,
		    			username: techData.username,
		    			photoURL: techData.photoURL,
		    		},
					}
					console.log(tech);
					docIndex += 1
					technicians.push(tech);
					if (docIndex === numOfTechs) {
						res(technicians);
					}
				}
			}
		} catch {(error) => {
			res(technicians);
			console.log("Error occured: firebase: businessGetFire: getTechniciansByIds")
		}}
	})
}

// get techs and their rating related to the post
const getTechsRating = (techs, busId, postId) => {
	return new Promise ( async (res, rej) => {
		let technicians = [];
		let docIndex = 0;
		const numOfTechs = techs.length;

		if (numOfTechs === 0) {
			res(technicians);
		}

		try {
			if (numOfTechs > 0) {
				let i;
				for (i = 0; i < numOfTechs; i++) {
					// get tech data
					const getTechData = await usersRef.doc(techs[i]).get();
					const techData = getTechData.data();

					// get tech average rating
					const getTechRatingBus = await usersRef.doc(busId).collection("technicians").doc(techs[i]).get();
					const techRatingBus = getTechRatingBus.data();

					// get tech rating for this post
					let techRatingPost;
					try {
						const getTechRatingPost = await usersRef.doc(busId).collection("technicians").doc(techs[i]).collection("post_ratings").doc(postId).get();
						techRatingPost = getTechRatingPost.data();
					} 
					catch {(error) => {
						rej(error);
					}}
					
					let tech = {
		    		techData: {
		    			id: techData.id,
		    			username: techData.username,
		    			photoURL: techData.photoURL,
		    			businessHours: techData.business_hours,
		    			specialHours: techData.special_hours
		    		},
		    		techRatingBus: {
		    			countRating: techRatingBus.countRating ? techRatingBus.countRating : 0,
		    			totalRating: techRatingBus.totalRating ? techRatingBus.totalRating : 0
		    		},
		    		techRatingPost: {
		    			countRating: 0,
		    			totalRating: 0
		    		}
					}

					if (techRatingPost !== undefined) {
						tech = { ...tech, ...{
								techRatingPost: {
				    			countRating: techRatingPost.countRating ? techRatingPost.countRating : 0,
				    			totalRating: techRatingPost.totalRating ? techRatingPost.totalRating : 0
				    		}
				    	}
				    }
				  }

					docIndex += 1
					technicians.push(tech);
					if (docIndex === numOfTechs) {
						res(technicians);
					}
				}
			}
		} 
		catch {(error) => {
			rej(error);
		}}
	})
};

// get tech avg rating
const getTechAvgRatingFire = (busId, techId) => {
	return new Promise ((res, rej) => {
		const getTechData = usersRef.doc(busId).collection("technicians").doc(techId).get();
		getTechData
		.then((doc) => {
			const techData = doc.data();
			res(techData);
		})
		.catch((error) => {
			rej(error);
		});
	});
};

// get tech rating related to a specific display post
const getTechRatingOfDPFire = (busId, techId, postId) => {
	return new Promise ((res, rej) => {

	});
};

const getTechBusinessHoursFire = (busId, techId) => {
	return new Promise ((res, rej) => {
		const getTechData = usersRef.doc(busId).collection("technicians").doc(techId).get();
		getTechData
		.then((doc) => {
			const techData = doc.data();
			if (techData.business_hours) {
				res(techData.business_hours)
			} else {
				res(null)
			}
		})
		.catch((error) => {
			rej(error);
		})
	});
};

const getBusUpcomingSpecialHours = (busId, specialHourLast) => {
	return new Promise ((res, rej) => {
		// allow fetching special hours from a day before
		const now = Date.now() - 24 * 60 * 60 * 1000;
		let specialHours = [];
		let getSpecialHours;

		if (specialHourLast) {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.orderBy("date_in_ms")
			.startAfter(specialHourLast)
			.limit(20)
		} else {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.orderBy("date_in_ms")
			.limit(20)
		}

		getSpecialHours
		.get()
		.then(async (querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;

			var lastVisible = querySnapshot.docs[docLength - 1];
			
			if (docLength > 0) {
				const hoursDocs = querySnapshot.docs.map((doc) => {
					const docData = doc.data();
					return docData
				});

				const specialHours = await Promise.all(hoursDocs);
				res({ specialHours: specialHours, lastSpecialHour: lastVisible, fetchSwitch: true });
			} else {
				res({ specialHours: [], lastSpecialHour: lastVisible, fetchSwitch: false });
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const getTechUpcomingSpecialHours = (busId, techId, specialHourLast) => {
	return new Promise ((res, rej) => {
		const now = Date.now();
		let specialHours = [];
		let getSpecialHours;

		if (specialHourLast) {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("technicians")
			.doc(techId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.orderBy("date_in_ms")
			.startAfter(specialHourLast)
			.limit(20)
		} else {
			getSpecialHours = usersRef
			.doc(busId)
			.collection("technicians")
			.doc(techId)
			.collection("special_hours")
			.where("date_in_ms", ">", now)
			.orderBy("date_in_ms")
			.limit(20)
		}
		getSpecialHours
		.get()
		.then(async (querySnapshot) => {
			let docIndex = 0;
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[docLength - 1];
			
			if (docLength > 0) {
				const hoursDocs = querySnapshot.docs.map((doc) => {
					const docData = doc.data();
					return docData;
				});

				const specialHours = await Promise.all(hoursDocs);
				res({ specialHours: specialHours, lastSpecialHour: lastVisible, fetchSwitch: true });
			} else {
				res({ specialHours: [], lastSpecialHour: lastVisible, fetchSwitch: false });
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const getScheduleBusinessSpecialHours = (busId, techId, dateInMs) => {
	return new Promise (async (res, rej) => {
		let busSpecialHours;
		let techSpecialHours;

		const techBusinessHours = await getTechBusinessHoursFire(busId, techId);

		const getBusSpecialHours = usersRef.doc(busId).collection("special_hours").where("date_in_ms", "==", dateInMs).get();

		await getBusSpecialHours
		.then((querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				querySnapshot.forEach((doc) => {
					const docData = doc.data();
					busSpecialHours = docData;
				});
			} else {
				busSpecialHours = null
			}
		})
		.catch((error) => {
			rej(error);
		});

		const getTechSpecialHours = usersRef
		.doc(busId)
		.collection("technicians")
		.doc(techId)
		.collection("special_hours")
		.where("date_in_ms", "==", dateInMs)
		.get();

		await getTechSpecialHours
		.then((querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				querySnapshot.forEach((doc) => {
					const docData = doc.data();
					techSpecialHours = docData;
				});
			} else {
				techSpecialHours = null
			}
		})
		.catch((error) => {
			rej(error);
		});

		res({ techBusinessHours: techBusinessHours, busSpecialHours: busSpecialHours, techSpecialHours: techSpecialHours })
	});
};

const getBusSpecialHourFire = (userId, year, monthIndex, date) => {
	return new Promise (async(res, rej) => {

		const getSpecialHour = usersRef
		.doc(userId)
		.collection("special_hours")
		.where("year", "==", year)
		.where("monthIndex", "==", monthIndex)
		.where("date", "==", date)

		getSpecialHour
		.get()
		.then((querySnapshot) => {
			const docLength = querySnapshot.docs.length;
			if (docLength > 0) {
				const specialHourDoc = querySnapshot.docs[0];
				const docData = specialHourDoc.data();
				res(docData);
			} else {
				res(null);
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
} 

export { 
	getTechnicians, 
	getTechniciansByIds, 
	getTechsRating, 

	getTechBusinessHoursFire,

	getBusUpcomingSpecialHours,
	getTechUpcomingSpecialHours,

	getBusSpecialHourFire,

	getScheduleBusinessSpecialHours
};