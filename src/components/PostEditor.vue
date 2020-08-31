<template>
  <form @submit.prevent="save">
    <div class="form-group">
        <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            class="form-input"
            v-model="text"
        ></textarea>
    </div>
    <div class="form-actions">
      <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit post'}}</button>
    </div>
  </form>
</template>

<script>

export default {
  name: "PostEditor",
  data() {
    return {
      text: this.post ? this.post.text : ''
    }
  },
  props: {
    threadId: {
      required: false,
      type: String,
    },
    post: {
      type: Object,
      validator: obj => {
        const keyIsValid = typeof obj['.key'] === 'string'
        const textIsValid = typeof obj['text'] === 'string'
        const valid = keyIsValid && textIsValid
        if (!keyIsValid) {
          console.error('The post prop object must include a `.key` attribute')
        }
        if (!textIsValid) {
          console.error('The post prop object must include a `text` attribute')
        }
        return valid
      }
    }
  },
  computed: {
    isUpdate() {
      return !!this.post
    }
  },

  methods: {
    save() {
      this.persist().then(post => {
        this.$emit('save', {post})
      })
    },

    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
      }

      this.text = ''

      this.$emit('save', {post})
      return this.$store.dispatch('createPost', post)
    },

    update() {
      const payload = {
        id: this.post['.key'],
        text: this.text
      }
      return this.$store.dispatch('updatePost', payload)
    },

    persist() {
      return this.isUpdate ? this.update() : this.create()
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>