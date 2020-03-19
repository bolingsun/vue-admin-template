<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- 这是xxx/index路由目录, 只有一级菜单时 -->
    <el-menu-item
      v-if="item.children && item.children.length === 1"
      :index="item.meta.fullPath"
    >
      <i class="iconfont" :class="item.meta.icon" style="margin-right:8px;"></i>
      <span slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
    <!-- 这个是多级菜单下的子菜单出口 -->
    <el-menu-item v-else-if="!item.children" :index="item.meta.fullPath">
      <span slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
    <!-- 这是多级菜单submenu -->
    <el-submenu v-else :index="item.path">
      <template slot="title">
        <i
          class="iconfont"
          :class="item.meta.icon"
          style="margin-right:8px;"
        ></i>
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
