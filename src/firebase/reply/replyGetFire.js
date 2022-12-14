import Firebase from '../../firebase/config'

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const getRepliesFire = (postId, commentId, lastReply = null, sorting = null) => {
	return new Promise (async (res, rej) => {
		const REPLY_LIMIT = 5;

		let repliesRef;
		if (lastReply) {
			if (sorting === "top") {
				repliesRef = postsRef
				.doc(postId)
				.collection("comments")
				.doc(commentId)
				.collection("replies")
				.orderBy("heat", "desc")
				.startAfter(lastReply)
			}
			else if (sorting === "new") {
				repliesRef = postsRef
				.doc(postId)
				.collection("comments")
				.doc(commentId)
				.collection("replies")
				.orderBy("createdAt", "desc")
				.startAfter(lastReply)
			}
			else {
				repliesRef = postsRef
				.doc(postId)
				.collection("comments")
				.doc(commentId)
				.collection("replies")
				.orderBy("heat", "desc")
				.startAfter(lastReply)
			}
		} else {
			if (sorting === "top") {
				repliesRef = postsRef
				.doc(postId)
				.collection("comments")
				.doc(commentId)
				.collection("replies")
				.orderBy("heat", "desc")
			}
			else if (sorting === "new") {
				repliesRef = postsRef
				.doc(postId)
				.collection("comments")
				.doc(commentId)
				.collection("replies")
				.orderBy("createdAt", "desc")
			}
			else {
				repliesRef = postsRef
				.doc(postId)
				.collection("comments")
				.doc(commentId)
				.collection("replies")
				.orderBy("heat", "desc")
			}
		};

		repliesRef
		.limit(REPLY_LIMIT)
		.get()
		.then((querySnapshot) => {
			const replies = [];
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			let fetchSwitch = false;
			fetchSwitch = docLength < REPLY_LIMIT ? false : true;
			let docIndex = 0;
			if (docLength > 0) {
	      querySnapshot.forEach(async (doc) => {
	      	const docId = doc.id;
	      	const docData = doc.data();
	      	
	      	const reply = {
	      		id: docId, 
	      		data: docData, 
	      	};

					replies.push(reply);

					docIndex += 1;

					if (docIndex === docLength) {
						//console.log("first hot post: ", hotPosts[0])
						res({fetchedReplies: replies, lastReply: lastVisible, fetchSwitch: fetchSwitch});
		  		}
	      });
	    } else {
	    	res({fetchedReplies: [], lastReply: null, fetchSwitch: false});
	    }
		});
	});
}


export default { 
	getRepliesFire
};