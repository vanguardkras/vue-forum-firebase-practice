import Vue from 'vue'

const makeAppendChildToParentMutation = ({parent, child}) =>
    (state, {childId, parentId}) => {
        const resource = state[parent][parentId]

        if (!resource[child]) {
            Vue.set(resource, child, {})
        }

        Vue.set(resource[child], childId, childId)
    }

export default {
    setAuthId(state, id) {
        state.authId = id
    },

    setPost(state, {post, postId}) {
        Vue.set(state.posts, postId, post)
    },

    setThread(state, {thread, threadId}) {
        Vue.set(state.threads, threadId, thread)
    },

    setUser(state, {user, userId}) {
        Vue.set(state.users, userId, user)
    },

    setItem(state, {item, id, resource}) {
        item['.key'] = id
        Vue.set(state[resource], id, item)
    },

    appendPostToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),
    appendContributorToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'contributors'}),
    appendPostToUser: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),
    appendThreadToForum: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'}),
    appendThreadToUser: makeAppendChildToParentMutation({parent: 'users', child: 'threads'})

}