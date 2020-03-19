<template>
  <div :class="classObj" style="height:100%;position:relative;overflow:auto;">
    <Header></Header>
    <Sidebar></Sidebar>
    <app-main></app-main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AppMain from "@/components/AppMain";
export default {
  name: "Layout",
  components: {
    Header,
    Sidebar,
    AppMain
  },
  data() {
    return {
      drawer: false,
      defaultAvatar: require("../assets/avatar.png")
    };
  },
  filters: {},
  computed: {
    ...mapGetters(["sidebar"]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
      };
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
