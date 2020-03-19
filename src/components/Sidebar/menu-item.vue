<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- 这是xxx/index路由目录 -->
    <el-menu-item
      v-if="item.children && item.children.length === 1"
      :index="item.meta.fullPath"
    >
      <span slot="title">?{{ item.meta.title }}</span>
    </el-menu-item>
    <!-- 这个是多级子菜单出口 -->
    <el-menu-item v-else-if="!item.children" :index="item.meta.fullPath">
      <span slot="title">*{{ item.meta.title }}</span>
    </el-menu-item>
    <el-submenu v-else :index="item.path">
      <template slot="title">
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <menu-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        router
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
export default {
  name: "MenuItem",
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
  methods: {
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path);
    },
    resolvePath(routePath) {
      if (this.isExternal(routePath)) {
        return routePath;
      }
      if (this.isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>

<style></style>
