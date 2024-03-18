<template>
  <n-flex vertical style="width: 100%; overflow: scroll; gap: 0">
    <n-flex style="
        padding: 4px 6px;
        flex-grow: 1;
        border-bottom: 1px solid var(--n-border-color);
      ">
      <n-grid x-gap="8" :cols="2">
        <n-gi>
          <n-flex justify="start" style="column-gap: 2px; align-items: center">
            <n-button @click="run()">Run <n-icon size="20" style="margin-left: 5px">
                <play />
              </n-icon></n-button>
            <n-checkbox size="small" label="auto" v-model:checked="auto_run" />
          </n-flex>
        </n-gi>
        <n-gi style="display: block">
          <n-select style="width: 150px" v-model:value="query_current_select" :options="query_options"></n-select>
        </n-gi>
      </n-grid>
    </n-flex>

    <splitpanes :horizontal="isMobile()" style="height: calc(100% - var(--header-height))">
      <pane :size="50">
        <codemirror class="code_text" 
          :extensions="extensions"
          style="width: 100%; height: 100%; overflow: scroll" v-model="run_str" type="textarea"
          placeholder='JSON Text { "a" : "123" }' />
      </pane>

      <pane :size="50" style="height: 100%; align-items: flex-start">
        <n-flex vertical style="height: 100%; width: 100%; overflow: scroll">
          <codemirror class="code_text" 
            :extensions="extensions"
            style="height: 100%; overflow: scroll" v-model="result_str"
            type="textarea" />
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
import { onMounted, ref, watch } from "vue";
import JSON5 from "json5";
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from "codemirror";
// import { oneDark } from '@codemirror/theme-one-dark'

const extensions = [javascript(), EditorView.lineWrapping]

function isMobile() {
  if (screen.width <= 760) {
    return true;
  }
  else {
    return false;
  }
}
async function quicktypeJSON(targetLanguage, typeName, jsonString) {

  const {
    quicktype,
    InputData,
    jsonInputForTargetLanguage
  } = await import("quicktype-core");

  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString]
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage
  });
}

const json_str = ref("");
const run_str = ref(localStorage.getItem("input_str") || "");
const result_str = ref("");
const auto_run = ref(JSON.parse(localStorage.getItem("jsonConvertor_auto") || 'false'));
const query_current_select = ref("JsonSchema");
const query_options = [
  {
    label: "CSV",
    value: "csv",
  },
  {
    label: "JsDoc",
    value: "jsdoc",
  },
  {
    label: "JSON Schema",
    value: "JsonSchema",
  },
  {
    label: "TypeScript",
    value: "typescript",
  },
];
async function run() {
  try {
    const obj = JSON5.parse(run_str.value);
    json_str.value = JSON.stringify(obj, null, 2);

    if (query_current_select.value == "csv") {
      const { default: json2csv } = await import("../lib/json2csv.js");
      const csv = json2csv(obj);
      result_str.value = csv
    }
    else if (query_current_select.value == "jsdoc") {
      const { default: json2jsdoc } = await import("../lib/json2jsdoc.js");
      const jsdoc = json2jsdoc(obj);
      result_str.value = jsdoc
    }
    else if (query_current_select.value == "JsonSchema") {
      const { lines: pythonPerson } = await quicktypeJSON("JSON Schema", "ObjectType", json_str.value);
      result_str.value = pythonPerson.join('\n')
    }
    else if (query_current_select.value == "typescript") {
      const { lines: pythonPerson } = await quicktypeJSON("TypeScript", "ObjectType", json_str.value);
      result_str.value = pythonPerson.join('\n')
    }
    localStorage.setItem("input_str", json_str.value);
  }
  catch (e) {
    result_str.value = e.toString()

  }
}

onMounted(() => {
  if (auto_run.value) run();
})
watch([auto_run], async () => {
  localStorage.setItem("jsonConvertor_auto", auto_run.value.toString());
})
watch([run_str, auto_run, query_current_select], async () => {
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

.splitpanes--vertical>.splitpanes__splitter {
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

.code_text {
  /* font-family: Menlo, Monaco, 'Courier New', monospace */
  width: 100%;
}
</style>
