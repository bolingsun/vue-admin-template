<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item)">
      <el-menu-item :index="resolvePath(item.path)">
        <i class="iconfont" :class="item.meta.icon" style="margin-right:8px;"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    <el-submenu v-else :index="item.path">
      <template slot="title">
        <i class="iconfont" :class="item.meta.icon" style="margin-right:8px;"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      ></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    hasOneShowingChild(parent) {
      // 没有子菜单
      if (!parent.children) {
        return true;
      }
      const showingChildren = parent.children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          return true;
        }
      });
      // 有子菜单，但是都是隐藏的，就只能显示这个父菜单
      if (showingChildren.length === 0) {
        return true;
      }
      // 否则，这个是多级菜单
      return false;
    },
    // 拼接父菜单的path和子菜单的path形成完成在fullpath路径
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>

<style></style>
