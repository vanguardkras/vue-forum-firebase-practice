<template>
  <div class="col-full" :class="$style.centered">
    <h1 :class="$style.headingLarge">Not Found</h1>
    <p :class="$style.textLarge">
      Oops, we couldn't find what you are looking for.
      Why don't you go
      <router-link :to="{name: 'Home'}">
        home
      </router-link>
      instead?
    </p>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
  created() {
    this.$emit('ready')
  }
}
</script>

<style module>
  .headingLarge {
    font-size: 100px;
  }
  .textLarge {
    font-size: 50px;
    font-weight: lighter;
  }
  .centered {
    text-align: center;
  }
</style>