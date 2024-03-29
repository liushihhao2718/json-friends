<template>
  <n-flex vertical style="width: 100%; overflow: scroll; gap: 0">
    <n-flex justify="space-between"
      style="padding: 4px 6px; flex-grow: 1;  border-bottom: 1px solid var(--n-border-color);">
      <n-flex justify="start" style="column-gap: 2px;align-items: center;">
        <n-button @click="togglePannel(0)" :tertiary="pannels[0].close">
          <n-icon size="24">
            <img :src="sidebar_left_svg" style="width: 100%;"></img>
          </n-icon>
        </n-button>
        <n-button @click="run()">Run <n-icon size="20" style="margin-left: 5px">
            <play />
          </n-icon></n-button>
        <n-checkbox size="small" label="auto" v-model:checked="auto_run" />

      </n-flex>

      <n-flex>
        <n-button justify="end" @click="() => { togglePannel(1); }"
          :tertiary="!pannels[1].close">
          <n-icon size="22">
            <img :src="code_json_svg" style="width: 100%;"></img>
          </n-icon>
        </n-button>
        <n-button justify="end" @click="togglePannel(3)" :tertiary="pannels[3].close">
          <n-icon size="24">
            <img :src="sidebar_right_svg" style="width: 100%;"></img>
          </n-icon>
        </n-button>
      </n-flex>
    </n-flex>

    <splitpanes :horizontal="isMobile()" style="height: calc(100% - var(--header-height));">
      <pane v-if="!pannels[0].close">
        <codemirror :extensions="extensions" class="code_text" style="height: 100%;width: 100%; overflow: scroll"
          v-model="run_str" type="textarea" placeholder='JSON Text { "a" : "123" }' />
      </pane>
      <pane v-if="!pannels[1].close">
        <codemirror :extensions="extensions" v-model="js_map_code" class="code_text"
          style="height: 100%;width: 100%; overflow: scroll" type="textarea" />

      </pane>

      <pane class="json_table">
        <component :is="() => json_render(input_str)" />
      </pane>
      <pane v-if="!pannels[3].close" style="align-items: flex-start;">
        <n-flex vertical style="height: 100%; width: 100%; overflow: scroll;">
          <div style="display: block;width: calc(100% - 20px);margin: 10px auto;">
            <n-flex style="flex-direction: row;">
              <n-select v-model:value="query_current_select" v-bind:style="{
          width: `calc(${Math.max(...query_options.map(q => q.label.length)) / 1.3}rem)`,
        }" :options="query_options" />

              <n-auto-complete style="margin-bottom: 15px; width: max-content; flex-grow: 1;" v-model:value="search_str"
                :input-props="{
          autocomplete: 'disabled'
        }" :options="search_auto_complete_options()" placeholder="JSON Pointer e.g. /foo/bar/0" clearable />
            </n-flex>
            <n-collapse>
              <n-collapse-item v-if="query_current_select == 'JSON Pointer'" title="What's JSON Pointer?" name="1">
                <n-card title="Example">
                  <p>A JSON Pointer is a list of zero-to-many tokens, each prefixed by <code>/</code>. Each token
                    can be
                    a string or a number. For example, given a JSON: </p>
                  <div class="fragment">
                    <div class="line">{</div>
                    <div class="line"> "foo" : ["bar", "baz"],</div>
                    <div class="line"> "pi" : 3.1416</div>
                    <div class="line">}</div>
                  </div>
                  <p>The following JSON Pointers resolve this JSON as:</p>
                  <ol type="1">
                    <li><code>"/foo"</code> → <code>[ "bar", "baz" ]</code></li>
                    <li><code>"/foo/0"</code> → <code>"bar"</code></li>
                    <li><code>"/foo/1"</code> → <code>"baz"</code></li>
                    <li><code>"/pi"</code> → <code>3.1416</code></li>
                  </ol>
                  <p>Note that, an empty JSON Pointer <code>""</code> (zero token) resolves to the whole JSON.</p>
                  <a href="https://rapidjson.org/md_doc_pointer.html">https://rapidjson.org/md_doc_pointer.html</a>
                </n-card>
              </n-collapse-item>

              <n-collapse-item v-else-if="query_current_select == 'JSON Path'" title="JSONPath - XPath for JSON"
                name="1">
                <n-card title="Example">
                  <pre style="margin: 0;"><code class="lang-json"><span>{
    <span class="hljs-attr">"Source"</span>: <span class="hljs-string">"Server-01"</span>,
    <span class="hljs-attr">"Timestamp"</span>: <span class="hljs-string">"2023-07-25T09:15:32.123Z"</span>,
    <span class="hljs-attr">"Log Level"</span>: <span class="hljs-string">"INFO"</span>,
    <span class="hljs-attr">"Message"</span>: <span class="hljs-string">"Application started successfully."</span>,
    <span class="hljs-attr">"Details"</span>: {
      <span class="hljs-attr">"Service"</span>: <span class="hljs-string">"AuthService"</span>,
      <span class="hljs-attr">"Endpoint"</span>: <span class="hljs-string">"/api/login"</span>,
      <span class="hljs-attr">"Response Code"</span>: <span class="hljs-number">200</span>,
      <span class="hljs-attr">"Response Time"</span>: <span class="hljs-number">54.21</span>,
      <span class="hljs-attr">"User"</span>: {
        <span class="hljs-attr">"User ID"</span>: <span class="hljs-string">"user123"</span>,
        <span class="hljs-attr">"Username"</span>: <span class="hljs-string">"kiana_anderson"</span>,
        <span class="hljs-attr">"IP Address"</span>: <span class="hljs-string">"192.168.1.100"</span>
      }
    }
  }</span>
</code>
</pre>
                  <p>您可以使用 JSONPath 表示法來代表每個欄位，如下所示：</p>
                  <pre class="has-inner-focus"><code class="lang-kusto" data-author-content="&quot;$.Source&quot;                     // Source field
&quot;$.Timestamp&quot;                  // Timestamp field
&quot;$['Log Level']&quot;               // Log Level field
&quot;$.Message&quot;                    // Message field
&quot;$.Details.Service&quot;            // Service field
&quot;$.Details.Endpoint&quot;           // Endpoint field
&quot;$.Details['Response Code']&quot;   // Response Code field
&quot;$.Details['Response Time']&quot;   // Response Time field
&quot;$.Details.User['User ID']&quot;    // User ID field
&quot;$.Details.User.Username&quot;      // Username field
&quot;$.Details.User['IP Address']&quot; // IP Address field
"><span><span class="hljs-string">"$.Source"</span>                     <span class="hljs-comment">// Source field</span>
<span class="hljs-string">"$.Timestamp"</span>                  <span class="hljs-comment">// Timestamp field</span>
<span class="hljs-string">"$['Log Level']"</span>               <span class="hljs-comment">// Log Level field</span>
<span class="hljs-string">"$.Message"</span>                    <span class="hljs-comment">// Message field</span>
<span class="hljs-string">"$.Details.Service"</span>            <span class="hljs-comment">// Service field</span>
<span class="hljs-string">"$.Details.Endpoint"</span>           <span class="hljs-comment">// Endpoint field</span>
<span class="hljs-string">"$.Details['Response Code']"</span>   <span class="hljs-comment">// Response Code field</span>
<span class="hljs-string">"$.Details['Response Time']"</span>   <span class="hljs-comment">// Response Time field</span>
<span class="hljs-string">"$.Details.User['User ID']"</span>    <span class="hljs-comment">// User ID field</span>
<span class="hljs-string">"$.Details.User.Username"</span>      <span class="hljs-comment">// Username field</span>
<span class="hljs-string">"$.Details.User['IP Address']"</span> <span class="hljs-comment">// IP Address field</span>
</span></code></pre>

                  <a class="n-a"
                    href="https://learn.microsoft.com/zh-tw/azure/data-explorer/kusto/query/jsonpath">https://learn.microsoft.com/zh-tw/azure/data-explorer/kusto/query/jsonpath</a>
                </n-card>
              </n-collapse-item>
            </n-collapse>

            <component style="margin: 1rem auto; display: block;" :is="() => search_path_table_render()" />

            <div style="margin-top: 5px;" v-if="search_value?.length > 0">
              <label>JSON</label>
              <n-input class="code_text" v-model:value="search_value" type="textarea" />
            </div>

          </div>
        </n-flex>
      </pane>
    </splitpanes>
  </n-flex>
</template>
<script setup lang="tsx">
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { NButton, NFlex, NInput, NIcon, NTable, NAutoComplete, NCollapse, NCollapseItem, NCard, NCheckbox, NSelect } from "naive-ui";
import { Play } from "@vicons/ionicons5";
import { ref, h, watch, onMounted } from "vue";
import JSON5 from "json5";
import json_pointer from "json-pointer";
import jp from "jsonpath";

import sidebar_left_svg from "../assets/icon/sidebar-left.svg";
import sidebar_right_svg from "../assets/icon/sidebar-right.svg";
import code_json_svg from "../assets/icon/code-json.svg"

import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from "codemirror";

const extensions = [javascript(), EditorView.lineWrapping]
const auto_run = ref(JSON.parse(localStorage.getItem("json2table_auto") || 'false'));
const run_str = ref(localStorage.getItem("input_str") || "");
let table_data = ref(null);
const sub_value = ref(null);
const input_str = ref('');

const js_map_code = ref(
  `// data.map( d => d.name )
return data;`);

const query_options = [{
  label: 'JSON Pointer',
  value: 'JSON Pointer',
},
{
  label: 'JSON Path',
  value: 'JSON Path',
}]

const json_table_pannels: Table_pannel[] = JSON.parse(
  localStorage.getItem("json_table_pannels") ||
  JSON.stringify([
    {
      close: false,
      size: 30,
      default_size: 30,
    },
    {
      close: true,
      size: 35,
      default_size: 35,
    },
    {
      close: false,
      size: 35,
      default_size: 35,
    },
    {
      close: false,
      size: 30,
      default_size: 30,
    },
  ])
);


const pannels = ref(json_table_pannels);
const query_current_select = ref(query_options[0].value);

const search_str = ref("");
const search_auto_complete_options = () => {

  if (query_current_select.value === 'JSON Pointer') {
    const search = search_str.value == '/' ? '' : search_str.value;
    sub_value.value = save_json_pointer_get(search, table_data.value);

    if (!sub_value.value) return []

    console.log('sub_value', sub_value)
    if (Array.isArray(sub_value.value)) {
      return [search + '/0']
    }

    return Object.keys(sub_value.value).map(key => search + '/' + key)
  }

  return []
}

onMounted(() => {
  if (auto_run.value) run();
});
watch([auto_run], async () => {
  localStorage.setItem("json2table_auto", auto_run.value.toString());
})
watch([run_str, js_map_code, auto_run], async () => {
  if (auto_run.value)
    run();
})

function isMobile() {
  if (screen.width <= 760) {
    return true;
  }
  else {
    return false;
  }
}

function run() {
  if (!pannels.value[1].close) {
    try {
      const compute_result = new Function(
        'data', `${js_map_code.value}`
      )(JSON5.parse(run_str.value));

      input_str.value = JSON.stringify(compute_result)
    } catch (e) {
      console.log(e)
    }

  } else {
    input_str.value = JSON.stringify(JSON5.parse(run_str.value))
  }

}

const search_value = ref('')


export interface Table_pannel {
  close: boolean;
  size: number;
  default_size: number;
}



async function togglePannel(index: number) {
  pannels.value[index].close = !pannels.value[index].close;

  const col_size = pannels.value[1].close ?
    pannels.value.filter((x, i) => i != 1).map((p) => {
      return p.close ? 0 : p.default_size;
    })
    : pannels.value.map((p) => {
      return p.close ? 0 : p.default_size;
    });


  if (pannels.value[1].close) {
    pannels.value.filter((x, i) => i != 1).forEach((x, i) => {
      x.size = size(i);
    });
  } else {
    pannels.value.forEach((x, i) => {
      x.size = size(i);
    });
  }



  localStorage.setItem("json_table_pannels", JSON.stringify(pannels.value));

  function size(index: number) {
    const sum = col_size.reduce((a, b) => a + b, 0);

    return Math.round((col_size[index] / sum) * 100);
  }
}

function json_render(str: string) {
  try {

    if (!pannels.value[1].close) {
      table_data.value = JSON5.parse(str);
      run_str.value = JSON.stringify(JSON.parse(run_str.value), null, 4);
      localStorage.setItem("input_str", run_str.value);

    } else {
      table_data.value = JSON5.parse(str);

      run_str.value = JSON.stringify(JSON.parse(run_str.value), null, 4);
      localStorage.setItem("input_str", str);

      search_str.value = search_str.value + '';
    }

  } catch (e) {
    table_data.value = null;

    return;
  }
  return table_render_click(obj2Table(table_data.value));
}


function update_search(e: Event, json_pointer: string) {
  e.stopPropagation();
  query_current_select.value = 'JSON Pointer';
  sub_value.value = save_json_pointer_get(json_pointer, table_data.value);
  search_str.value = json_pointer;

  console.log(json_pointer);
}
function table_render_click(obj?: { type: string, value: any }, json_pointer = '') {
  if (!obj) return;
  if (obj.type == "Array") {
    return (
      <NTable single-line={false} size="small" data-pointer={json_pointer}>
        <thead onClick={e => update_search(e, json_pointer)}>
          <tr>
            <th>Array</th>
          </tr>
        </thead>
        <tbody>
          {obj.value.map((o, i) => {
            return (
              <tr>
                <td>{table_render_click(o, `${json_pointer}/${i}`)}</td>
              </tr>
            );
          })}
        </tbody>
      </NTable>
    );
  }

  if (obj.type == 'sameArrayField') {
    return (
      <NTable single-line={false} size="small">
        <thead>
          <tr>
            {
              obj.value[0].type === 'Object' ? obj.value[0].value.map(key => <th>{key.name}</th>)
                : <th>{obj.value[0].type}</th>
            }
          </tr>
        </thead>
        <tbody>
          {
            obj.value.map((v, v_i) => <tr>{
              v.type === 'Object' ?
                v.value.map(vv => <td>{table_render_click(vv.value, `${json_pointer}/${v_i}${vv.value.type == 'Primitive' ? '' : '/' + vv.name}`)}</td>)
                : <td>{table_render_click(v, `${json_pointer}/${v_i}`)}</td>
            }</tr>)

          }
        </tbody>
      </NTable>
    );
  }

  if (obj.type == "Object") {
    return (<NTable single-line={false} size="small">
      <tr data-pointer={json_pointer} onClick={e => update_search(e, json_pointer)}>
        <th>Key</th>
        <th>Value</th>
      </tr>
      <tbody>{
        obj.value.map(o => {
          return (
            <tr onClick={e => update_search(e, json_pointer + `/${o.name}`)}>
              <td>{o.name}</td>
              <td>{table_render_click(o.value, `${json_pointer}/${o.name}`)}</td>
            </tr>
          );
        })
      }
      </tbody>
    </NTable>
    );
  }

  if (obj.type == "Primitive")
    return <span onClick={e => update_search(e, json_pointer)}>
      {obj.value.toString()}</span>;
}

function table_render(obj: { type: string, value: any }) {
  if (!obj) return;
  if (obj.type == "Array") {
    return (
      <NTable single-line={false} size="small">
        <thead>
          <tr>
            <th>Array</th>
          </tr>
        </thead>
        <tbody>
          {obj.value.map((o) => {
            return (
              <tr>
                <td>{table_render(o)}</td>
              </tr>
            );
          })}
        </tbody>
      </NTable>
    );
  }

  if (obj.type == 'sameArrayField') {
    return (
      <NTable single-line={false} size="small">
        <thead>
          <tr>
            {
              obj.value[0].type === 'Object' ?
                obj.value[0].value.map(key => <th>{key.name}</th>)
                : <th>{obj.value[0].type}</th>
            }
          </tr>
        </thead>
        <tbody>
          {
            obj.value.map(v => <tr>{
              v.type === 'Object' ?
                v.value.map(vv => <td>{table_render(vv.value)}</td>)
                : <td>{table_render(v)}</td>
            }</tr>)

          }
        </tbody>
      </NTable>
    );
  }

  if (obj.type == "Object") {
    return (<NTable single-line={false} size="small">
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
      <tbody>{
        obj.value.map(o => {
          return (
            <tr>
              <td>{o.name}</td>
              <td>{table_render(o.value)}</td>
            </tr>
          );
        })
      }
      </tbody>
    </NTable>
    );
  }

  if (obj.type == "Primitive") return h("span", obj.value.toString());
}
function obj2Table(obj: any): { type: string, value: any } | undefined {
  if (obj === null) return {
    type: "Primitive",
    value: 'null',
  };

  if (Array.isArray(obj)) {

    return {
      type: sameArrayField(obj) ? "sameArrayField" : "Array",
      value: obj.map((o) => obj2Table(o)),
    };
  }

  if (typeof obj === "object") {
    return {
      type: "Object",
      value: Object.entries(obj).map(([k, v]) => {
        return {
          name: k,
          value: obj2Table(v),
        };
      }),
    };
  }

  if (isPrimitive(obj)) {
    return {
      type: "Primitive",
      value: obj,
    };
  }
}

function sameArrayField(arr: Array<any>) {
  return arr
    .map(obj => Object.keys(obj).join('|'))
    .every((val, i, arr) => val === arr[0])
    && !Array.isArray(arr[0])
    && arr.length > 1
}

function isPrimitive(str: any) {
  return [
    "string",
    "number",
    "bigint",
    "boolean",
    "undefined",
    "symbol",
    "null",
    "object",
  ].includes(typeof str);
}

watch([search_str, query_current_select], async () => {
  try {
    let pointer_obj;

    switch (query_current_select.value) {
      case 'JSON Pointer':
        pointer_obj = json_pointer.get(table_data.value || {}, search_str.value);
        break;
      case 'JSON Path':
        pointer_obj = jp.query(table_data.value, search_str.value)
        break;
      default:
        break;
    }

    sub_value.value = pointer_obj;
    search_value.value = JSON.stringify(pointer_obj);

  } catch (e) {
    search_value.value = e.toString();
  }

})
function save_json_pointer_get(pointer_str: string, target_obj: any) {
  try {
    const pointer_obj = json_pointer.get(target_obj, pointer_str);
    return pointer_obj;
  } catch (e) {
    return undefined;
  }
}
function search_path_table_render() {
  try {
    if (!sub_value.value) return <p>empty object</p>


    return table_render(obj2Table(sub_value.value));
  }
  catch (e) {
    // search_value.value = e;

    return <p>{e.toString()}</p>
  }

}


</script>
<style>
:root {
  --header-height: 43px;
  --n-border-color: rgb(239, 239, 245)
}

.splitpanes__pane {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica, Arial, sans-serif;
  color: gray;
  flex-grow: 1;
}

.splitpanes--horizontal>.splitpanes__splitter {
  height: 5px;
  background-color: darkgray;
  flex-shrink: 0;
}

.splitpanes--vertical>.splitpanes__splitter {
  width: 5px;
  background-color: darkgray;
  flex-shrink: 0;
}

.json_table {
  /* font-size: 16px; */
  overflow: scroll;
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
  font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
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
  font-family: Menlo, Monaco, 'Courier New', monospace
}
</style>
