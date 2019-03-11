<template>
  <section>
    <p>对不住，这个名为 {{ username }} 的用户我们找不到！！！无法给您进入主页面</p>
  </section>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      username: this.$store.state.username
    }
  }
}
</script>