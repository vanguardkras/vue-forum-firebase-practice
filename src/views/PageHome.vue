<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import {mapActions} from 'vuex'
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: 'HelloWorld',

  components: {
    CategoryList
  },

  mixins: [asyncDataStatus],

  computed: {
    categories() {
      return Object.values(this.$store.state.categories)
    }
  },

  methods: {
    ...mapActions(['fetchAllCategories'])
  },

  created() {
    this.fetchAllCategories()
        .then(() => {
          this.asyncDataStatus_fetched()
        })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
