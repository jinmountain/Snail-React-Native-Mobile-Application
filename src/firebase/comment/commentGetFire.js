import Firebase from '../../firebase/config'

const usersRef = Firebase.firestore().collection("users");
const postsRef = Firebase.firestore().collection("posts");

const getTopComment = (postId) => {
	return new Promise (async (res, rej) => {
		const getTopCommentRef = postsRef.doc(postId).collection("comments").orderBy("heat", "desc").limit(1);
		
		let topComment = null;
		
		await getTopCommentRef
		.get()
		.then((commentQuerySnaphot) => {
			const commentQueryLen = commentQuerySnaphot.docs.length;
			if (commentQueryLen === 1) {
				commentQuerySnaphot.forEach((doc) => {
					docId = doc.id;
					docData = doc.data();
					const comment = {
						id: docId,
						data: docData
					};

					res(comment);
				});
			} else {
				res(null);
			}
		})
		.catch((error) => {
			rej(error);
		});
	});
};

const getCommentsFire = (
	postId, 
	lastComment = null, 
	sorting = null
) => {
	return new Promise (async (res, rej) => {
		const COMMENT_LIMIT = 5;

		const topCommentRef = () => {
			return (
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("heat", "desc")
				.startAfter(lastComment)
			)
		};

		const newCommentRef = () => {
			return (
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("createdAt", "desc")
				.startAfter(lastComment)
			)
		};

		let commentsRef;
		if (lastComment) {
			if (sorting === 'top') {
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("heat", "desc")
				.startAfter(lastComment)
			}
			else if (sorting === 'new') {
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("createdAt", "desc")
				.startAfter(lastComment)
			}
			else {
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("heat", "desc")
				.startAfter(lastComment)
			}
		} else {
			if (sorting === 'top') {
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("heat", "desc")
			}
			else if (sorting === 'new') {
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("createdAt", "desc")
			} 
			else {
				commentsRef = postsRef
				.doc(postId)
				.collection("comments")
				.orderBy("heat", "desc")
			}
		};

		commentsRef
		.limit(COMMENT_LIMIT)
		.get()
		.then((querySnapshot) => {
			const comments = [];
			const docLength = querySnapshot.docs.length;
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			let fetchSwitch = false;
			fetchSwitch = docLength < COMMENT_LIMIT ? false : true;
			let docIndex = 0;
			if (docLength > 0) {
	      querySnapshot.forEach(async (doc) => {
	      	const docId = doc.id;
	      	const docData = doc.data();
	      	
	      	const comment = {
	      		id: docId, 
	      		data: docData, 
	      	};

					comments.push(comment);

					docIndex += 1;

					if (docIndex === docLength) {
						//console.log("first hot post: ", hotPosts[0])
						res({fetchedComments: comments, lastComment: lastVisible, fetchSwitch: fetchSwitch});
		  		}
	      });
	    } else {
	    	res({fetchedComments: [], lastComment: null, fetchSwitch: false});
	    }
		});
	});
}


export default { 
	getTopComment,
	getCommentsFire
};