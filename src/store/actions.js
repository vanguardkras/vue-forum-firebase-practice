import firebase from "firebase/app"
import 'firebase/database'
import 'firebase/auth'

export default {
    createPost({commit, state}, post) {
        const postId = firebase.database().ref('posts').push().key
        post.userId = state.authId
        post.publishedAt = Math.floor(Date.now() / 1000)

        const updates = {}
        updates[`posts/${postId}`] = post
        updates[`threads/${post.threadId}/posts/${postId}`] = postId
        updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
        updates[`users/${post.userId}/posts/${postId}`] = postId
        firebase.database().ref().update(updates)
            .then(() => {
                commit('setItem', {resource: 'posts', item: post, id: postId})
                commit('appendPostToThread', {parentId: post.threadId, childId: postId})
                commit('appendContributorToThread', {parentId: post.threadId, childId: post.userId})
                commit('appendPostToUser', {parentId: post.userId, childId: postId})

                return Promise.resolve(state.posts[postId])
            })
    },
    createThread({state, commit, dispatch}, {text, title, forumId}) {
        return new Promise((resolve, reject) => {

            const threadId = firebase.database().ref('threads').push().key
            const postId = firebase.database().ref('posts').push().key
            const publishedAt = Math.floor(Date.now() / 1000)
            const userId = state.authId

            const thread = {title, forumId, publishedAt, userId, firstPostId: postId, posts: {}}
            thread.posts[postId] = postId
            const post = {text, publishedAt, threadId, userId}


            const updates = {}
            updates[`threads/${threadId}`] = thread
            updates[`forums/${forumId}/threads/${threadId}`] = threadId
            updates[`users/${userId}/threads/${threadId}`] = threadId

            updates[`posts/${postId}`] = post
            updates[`users/${userId}/posts/${postId}`] = postId

            firebase.database().ref().update(updates)
                .then(() => {

                    //update thread
                    commit('setItem', {resource: 'threads', item: thread, id: threadId})
                    commit('appendThreadToForum', {parentId: forumId, childId: threadId})
                    commit('appendThreadToUser', {parentId: userId, childId: threadId})

                    //update post
                    commit('setItem', {resource: 'posts', item: post, id: postId})
                    commit('appendPostToThread', {parentId: post.threadId, childId: postId})
                    commit('appendPostToUser', {parentId: post.userId, childId: postId})

                    resolve(state.threads[threadId])
                })
        })
    },

    createUser({state, commit}, {id, email, name, username, avatar = null,}) {
        return new Promise((resolve, reject) => {
            const registeredAt = Math.floor(Date.now() / 1000)
            const usernameLower = username.toLowerCase()
            email = email.toLowerCase()
            const user = {avatar, email, name, username, usernameLower, registeredAt}
            firebase.database().ref('users').child(id).set(user)
                .then(() => {
                    commit('setItem', {resource: 'users', item: user, id: id})
                    resolve(state.users[id])
                })
        })
    },

    registerUserWithEmailAndPassword({dispatch}, {email, name, username, password, avatar = null}) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                return dispatch('createUser', {id: user.user.uid, email, name, username, password, avatar})
            })
            .then(() => dispatch('fetchAuthUser'))
    },

    signInWithEmailAndPassword(context, {email, password}) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    signInWithGoogle({dispatch}) {
        const provider = new firebase.auth.GoogleAuthProvider()
        return firebase.auth().signInWithPopup(provider)
            .then(data => {
                const user = data.user
                firebase.database().ref('users').child(user.uid).once('value', snapshot => {
                    if (!snapshot.exists()) {
                        return dispatch('createUser', {
                            id: user.uid,
                            name: user.displayName,
                            email: user.email,
                            username: user.email,
                            avatar: user.photoURL
                        }).then(() => dispatch('fetchAuthUser'))
                    }
                })
            })
    },

    signOut({commit}) {
        return firebase.auth().signOut()
            .then(() => {
                commit('setAuthId', null)
            })
    },

    updatePost({state, commit}, {id, text}) {
        return new Promise((resolve, reject) => {
            const post = state.posts[id]
            const edited = {at: Math.floor(Date.now() / 1000), by: state.authId}


            const updates = {text, edited}

            firebase.database().ref('posts').child(id).update(updates)
                .then(() => {
                    commit('setPost', {postId: id, post: {...post, text, edited}})
                    resolve(post)
                })

        })
    },

    updateThread({state, commit, dispatch}, {title, text, id}) {
        return new Promise((resolve, reject) => {
            const thread = state.threads[id]
            const post = state.posts[thread.firstPostId]

            const edited = {
                at: Math.floor(Date.now() / 1000),
                by: state.authId
            }

            const updates = {}
            updates[`posts/${thread.firstPostId}/text`] = text
            updates[`posts/${thread.firstPostId}/edited`] = edited
            updates[`threads/${id}/title`] = title


            firebase.database().ref().update(updates)
                .then(() => {
                    commit('setThread', {thread: {...thread, title}, threadId: id})
                    commit('setPost', {postId: thread.firstPostId, post: {...post, text, edited}})
                    resolve(post)
                })

        })
    },

    updateUser({state, commit}, user) {
        commit('setUser', {userId: user['.key'], user})
    },

    fetchAllCategories({state, commit, dispatch}) {
        console.log('🔥', '👨‍👨‍👧‍👧', 'all')
        return new Promise((resolve, reject) => {
            const forumIds = [];
            firebase.database().ref('categories').once('value', snapshot => {
                const categoriesObject = snapshot.val()
                Object.keys(categoriesObject).forEach(categoryId => {
                    const category = categoriesObject[categoryId]
                    commit('setItem', {resource: 'categories', id: categoryId, item: category})
                    Object.keys(category.forums).forEach(forumId => forumIds.push(forumId))
                })
            }).then(() => {
                return dispatch('fetchForums', {ids: forumIds})
            }).then(() => {
                resolve(forumIds)
            })
        })
    },

    fetchAuthUser({dispatch, commit}) {
        const userId = firebase.auth().currentUser.uid
        return new Promise((resolve, reject) => {
            firebase.database().ref('users').child(userId).once('value', snapshot => {
                if (snapshot.exists()) {
                    return dispatch('fetchUser', {id: userId})
                        .then(user => {
                            commit('setAuthId', userId)
                            resolve(user)
                        })
                } else {
                    resolve(null)
                }
            })
        })
    },

    fetchCategories: ({dispatch}, {ids}) => dispatch('fetchItems', {ids, resource: 'categories', emoji: '👨‍👨‍👧‍👧'}),
    fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {ids, resource: 'forums', emoji: '🥼'}),
    fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {ids, resource: 'posts', emoji: '🗐'}),
    fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {ids, resource: 'threads', emoji: '📗'}),
    fetchUsers: ({dispatch}, {id}) => dispatch('fetchItems', {id, resource: 'users', emoji: '🧑'}),

    fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {id, resource: 'categories', emoji: '📗'}),
    fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {id, resource: 'forums', emoji: '📗'}),
    fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {id, resource: 'threads', emoji: '📗'}),
    fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {id, resource: 'users', emoji: '🧑'}),
    fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {id, resource: 'posts', emoji: '📄'}),

    fetchItem({state, commit}, {id, resource, emoji}) {
        console.log('🔥', emoji, id)
        return new Promise((resolve, reject) => {
            firebase.database().ref(resource).child(id).once('value', snapshot => {
                commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
                resolve(state[resource][id])
            })
        })
    },

    fetchItems({dispatch}, {ids, resource, emoji}) {
        ids = Array.isArray(ids) ? ids : Object.keys(ids)
        return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})))
    }
}