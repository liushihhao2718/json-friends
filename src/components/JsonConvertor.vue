<template>
  <n-flex vertical style="width: 100%; overflow: scroll; gap: 0">
    <n-flex
      style="
        padding: 4px 6px;
        flex-grow: 1;
        border-bottom: 1px solid var(--n-border-color);
      "
    >
      <n-grid x-gap="8" :cols="2">
        <n-gi>
          <n-flex justify="start" style="column-gap: 2px; align-items: center">
            <n-button @click="run()"
              >Run <n-icon size="20" style="margin-left: 5px"> <play /> </n-icon
            ></n-button>
            <n-checkbox size="small" label="auto" v-model:checked="auto_run" />
          </n-flex>
        </n-gi>
        <n-gi style="display: block">
          <n-select
            style="width: 150px"
            v-model:value="query_current_select"
            :options="query_options"
          ></n-select>
        </n-gi>
      </n-grid>
    </n-flex>

    <splitpanes style="height: calc(100% - var(--header-height))">
      <pane :size="50">
        <n-input
          style="height: 100%; overflow: scroll"
          v-model:value="run_str"
          type="textarea"
          placeholder='JSON Text { "a" : "123" }'
        />
      </pane>

      <pane :size="50" style="height: 100%; align-items: flex-start">
        <n-flex vertical style="height: 100%; width: 100%; overflow: scroll">
          <n-input
            style="height: 100%; overflow: scroll"
            v-model:value="result_str"
            type="textarea"
          />
        </n-flex>
      </pane>
    </splitpanes>
  </n-flex>
</template>
<script setup lang="tsx">
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import {
  NButton,
  NFlex,
  NInput,
  NIcon,
  NCheckbox,
  NSelect,
  NGrid,
  NGi,
} from "naive-ui";
import { Play } from "@vicons/ionicons5";
import { ref, h, computed, watch } from "vue";
import JSON5 from "json5";
import json2csv from "../lib/json2csv.js";
import json2jsdoc from "../lib/json2jsdoc.js";

const json_str = ref("");
const run_str = ref("");
const result_str = ref("result_str");
const auto_run = ref(false);
const query_current_select = ref("jsdoc");
const query_options = [
  {
    label: "CSV",
    value: "csv",
  },
  {
    label: "JsDoc",
    value: "jsdoc",
  },
];
function run() {
  json_str.value = run_str.value;
  const obj = JSON5.parse(json_str.value);

  if (query_current_select.value == "csv") {
    const csv = json2csv(obj);
    result_str.value = csv
  }
  else if(query_current_select.value = "jsdoc"){
    const jsdoc = json2jsdoc(obj);
    result_str.value = jsdoc
  }
}

watch([run_str, auto_run], async (old_value, new_value) => {
  if (auto_run.value) run();
});
</script>
<style>
:root {
  --header-height: 43px;
  --n-border-color: rgb(239, 239, 245);
}
.splitpanes__pane {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica, Arial, sans-serif;
  color: gray;
  flex-grow: 1;
}
.splitpanes--vertical > .splitpanes__splitter {
  width: 5px;
  background-color: darkgray;
  flex-shrink: 0;
}

.json_table {
  /* font-size: 16px; */
  overflow-y: scroll;
  display: block;
}
.n-table {
  width: fit-content;
  margin: auto;
}

.n-table.n-table--bordered tr:last-child td {
  border-bottom: 1px solid var(--n-border-color);
}
td:first-child {
  width: 10%;
}
div.fragment {
  margin: 4px 8px 4px 2px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  font-size: 13px;
  line-height: 19px;
  overflow: auto;
  padding: 6px 10px;
  border-radius: 3px;
}

div.line {
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 13px;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  line-height: 19px;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-indent: -53px;
  padding-left: 53px;
  padding-bottom: 0px;
  margin: 0px;
}
</style>
