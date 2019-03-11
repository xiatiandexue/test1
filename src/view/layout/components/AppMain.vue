<template>
  <section class="app-main">
    <transition name="fade-transform"
                mode="out-in">
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
   
    key () {
      return this.$route.fullPath.split('#')[0]
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  height: calc(100% - 84px);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
