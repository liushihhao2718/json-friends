<template>
  <div class="wrapper">
    <n-flex style="height: 100%; width: 100%; overflow: scroll">
      <n-layout has-sider style="height: 100%">
        <n-layout-sider bordered show-trigger="arrow-circle" collapse-mode="width" :collapsed-width="64" :width="240"
          :native-scrollbar="false" :collapsed="!siderOpen" @collapse="siderOpen = false" @expand="siderOpen = true">
          <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
        </n-layout-sider>
        <router-view></router-view>
      </n-layout>
    </n-flex>

    <!-- <footer>footer</footer> -->
  </div>
</template>

<script setup lang="tsx">
import { NFlex, NLayout, NLayoutSider, NIcon, NMenu } from "naive-ui";
import { RouterView, RouterLink } from 'vue-router';
import { h, ref } from "vue";
import { PlayForward } from "@vicons/ionicons5";

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => <RouterLink to={{ path: "/json2table" }}>json to table</RouterLink>,
    key: "json2table",
    icon: renderIcon(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,2H3A1,1,0,0,0,2,3V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V3A1,1,0,0,0,21,2ZM8,20H4V4H8Zm12,0H10V13H20Zm0-9H10V4H20Z" />
    </svg>),
  },
  {
    label: () => <RouterLink to={{ path: "/jsonConvertor" }}>json convertor</RouterLink>,
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
