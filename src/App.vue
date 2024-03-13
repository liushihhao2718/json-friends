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
            :value="current_view"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            @update:value="handleApp"
          />
        </n-layout-sider>
        <component :is="() => main_view_render()" />
      </n-layout>
    </n-flex>

    <!-- <footer>footer</footer> -->
  </div>
</template>

<script setup lang="tsx">
import JsonTable from "./components/JsonTable.vue";
import JsonConvertor from "./components/JsonConvertor.vue";
import "splitpanes/dist/splitpanes.css";
import window_grid from "./assets/icon/window-grid.svg";
import { NFlex, NLayout, NLayoutSider, NIcon, NMenu } from "naive-ui";

import { h, ref } from "vue";
import { PlayForward } from "@vicons/ionicons5";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: "Json to Table",
    key: "json2table",
    icon: renderIcon(<img src={window_grid} style="width: 100%;"></img>),
  },
  {
    label: "Json Convert",
    key: "jsonConvertor",
    icon: renderIcon(PlayForward),
  },
];

const current_view = ref("json2table");

const siderOpen = ref(false);

function handleApp(key: string, item: string) {
  console.log(key);

  current_view.value = key;
}

function main_view_render(): JSX.Element {
  const main_view = {
    json2table: <JsonTable></JsonTable>,
    jsonConvertor: <JsonConvertor></JsonConvertor>,
  };

  return main_view[current_view.value];
}
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
