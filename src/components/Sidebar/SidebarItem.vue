<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <el-menu-item :index="item.meta.fullPath">
        <i
          class="iconfont"
          :class="item.meta.icon"
          style="margin-right:8px;"
        ></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    <el-submenu v-else :index="item.path">
      <template slot="title">
        <i
          class="iconfont"
          :class="item.meta.icon"
          style="margin-right:8px;"
        ></i>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      ></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          return true;
        }
      });
      // 首页特殊处理
      if (parent.children && parent.children[0].path === "home") {
        return true;
      }
      // 只有一个菜单的路由，子菜单其实是父菜单的影子
      if (showingChildren.length === 1 && showingChildren[0].path === "") {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        return true;
      }

      return false;
    }
  }
};
</script>

<style></style>
