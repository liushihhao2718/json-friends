<template>
  <div class="wrapper">
    <n-flex style="height: 100%; width: 100%; overflow: scroll">
      <n-layout has-sider style="height: 100%">
        <n-layout-sider
          bordered
          show-trigger="arrow-circle"
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
          :collapsed="!siderOpen"
          @collapse="siderOpen = false"
          @expand="siderOpen = true"
        >
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        <router-view></router-view>
      </n-layout>
    </n-flex>

    <!-- <footer>footer</footer> -->
  </div>
</template>

<script setup lang="tsx">
import "splitpanes/dist/splitpanes.css";
import window_grid from "./assets/icon/window-grid.svg";
import { NFlex, NLayout, NLayoutSider, NIcon, NMenu } from "naive-ui";
import { RouterView, RouterLink } from 'vue-router';
import { h, ref } from "vue";
import { PlayForward } from "@vicons/ionicons5";

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: ()=> <RouterLink to={{path:"/json2table"}}/>,
    key: "json2table",
    icon: renderIcon(<img src={window_grid} style="width: 100%;"></img>),
  },
  {
    label: ()=> <RouterLink to={{path:"/jsonConvertor"}}/>,
    key: "jsonConvertor",
    icon: renderIcon(PlayForward),
  },
];

const siderOpen = ref(false);

</script>

<style>
.wrapper,
html,
body {
  height: 100%;
  margin: 0;
}
.wrapper {
  display: flex;
  flex-direction: column;
}

#row3 {
  background-color: lightgray;
  flex: 2;
  display: flex;
}
footer {
  background-color: lightblue;
}

.n-scrollbar {
  overflow: visible;
}
</style>
