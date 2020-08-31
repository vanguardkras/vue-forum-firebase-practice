<template>
  <div v-if="post && user" class="post">

    <div class="user-info">
      <a href="#" class="user-name">{{ user.name }}</a>

      <a href="#">
        <img class="avatar-large" :src="user.avatar" alt="">
      </a>

      <p class="desktop-only text-small">{{ usersThreadsCount }} threads</p>
      <p class="desktop-only text-small">{{ usersPostsCount }} posts</p>

    </div>

    <div class="post-content">
      <template v-if="!editing">
        <div>
          {{ post.text }}
        </div>
        <a @click.prevent="editing=true" href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change"><i class="fa fa-pencil"></i></a>
      </template>
      <div style="width: 100%" v-else>
        <PostEditor
            :post="post"
            @save="editing = false"
            @cancel="editing = false"
        />
      </div>


    </div>
    <div class="post-date text-faded">
      <div v-if="post.edited" class="edition-info">edited</div>
      <AppDate :timestamp="post.publishedAt"/>
    </div>

  </div>
</template>

<script>
import PostEditor from "@/components/PostEditor"

export default {
  name: "PostListItem",
  components: {
    PostEditor
  },
  data() {
    return {
      users: this.$store.state.users,
      editing: false
    }
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    user() {
      return this.users[this.post.userId]
    },
    usersPostsCount() {
      return this.$store.getters.userPostsCount(this.post.userId)
    },
    usersThreadsCount() {
      return this.$store.getters.userThreadsCount(this.post.userId)
    }
  }
}
</script>

<style scoped>

</style>