<template>
  <div class="wrapper">
    <n-flex style="height: 100%; width: 100%; overflow: scroll;">
      <n-layout has-sider style="height: 100%;">
        <n-layout-sider
          bordered
          show-trigger="arrow-circle"
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
          :collapsed="!siderOpen"
        >
          <n-button
            class="toggle-button"
            strong
            secondary
            circle
            type="primary"
            @click="toggleSider()"
          >
            <template #icon>
              <n-icon><ArrowBackOutline /></n-icon>
            </template>
          </n-button>
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        <JsonTable ></JsonTable>
      </n-layout>
    </n-flex>

    <!-- <footer>footer</footer> -->
  </div>
</template>

<script setup>
import JsonTable from "./components/JsonTable.vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { NButton, NFlex, NLayout, NLayoutSider, NIcon, NMenu } from "naive-ui";

import { h, ref } from "vue";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  GridOutline,
  ArrowBackOutline,
} from "@vicons/ionicons5";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: "Json to Table",
    key: "json2table",
    icon: renderIcon(GridOutline),
  },
];

const siderOpen = ref(false);
function toggleSider() {
  siderOpen.value = !siderOpen.value;
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

.n-layout-sider .n-layout-toggle-button {
  display: none;
}
.n-scrollbar {
  overflow: visible;
}

.toggle-button {
  transition: color 0.3s var(--n-bezier), right 0.3s var(--n-bezier),
    left 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier),
    background-color 0.3s var(--n-bezier);
  cursor: pointer;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 50%;
  right: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--n-toggle-button-icon-color);
  border: var(--n-toggle-button-border);
  background-color: var(--n-toggle-button-color);
  box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.06);
  transform: translateX(50%) translateY(-50%);
  z-index: 2;
}
</style>
