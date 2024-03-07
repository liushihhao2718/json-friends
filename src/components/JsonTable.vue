<template>
  <n-flex vertical style="width: 100%; overflow: scroll; gap: 0">
    <n-flex
      justify="space-between"
      style="padding: 4px 6px; flex-grow: 1;  border-bottom: 1px solid var(--n-border-color);"
    >
      <n-flex justify="start" style="column-gap: 2px">
        <n-button @click="togglePannel(0)" style="align-items: center;">
        <n-icon size="24">
          <img :src="sidebar_left_svg" style="width: 100%;"></img>
        </n-icon>
        </n-button>
        <n-button
          >Run <n-icon size="20" style="margin-left: 5px"> <play /> </n-icon
        ></n-button>
      </n-flex>

      <n-button justify="end" @click="togglePannel(2)"> 
        <n-icon size="24">
          <img :src="sidebar_right_svg" style="width: 100%;"></img>
        </n-icon>
      </n-button>
    </n-flex>

    <splitpanes style="height: calc(100% - var(--header-height));">
      <pane :size="pannels[0].size" style="">
        <n-input
          style="height: 100%; overflow: scroll"
          v-model:value="input_str"
          type="textarea"
          placeholder='JSON Text { "a" : "123" }'
        />
      </pane>
      <pane :size="pannels[1].size" class="json_table">
        <component :is="() => json_render(input_str)" />
      </pane>
      <pane :size="pannels[2].size" style="height: 100%; align-items: flex-start;">
        <n-flex vertical style="height: 100%; width: 100%; overflow: scroll;">
        <div style="display: block;width: calc(100% - 20px);margin: 10px auto;">
          <n-auto-complete
            style="margin-bottom: 15px;" 
            v-model:value="search_str"
            :input-props="{
              autocomplete: 'disabled'
            }"
            :options="search_auto_complete_options"
            placeholder="JSON Pointer e.g. /foo/bar/0"
            clearable
          />
          <n-collapse>
            <n-collapse-item title="What's JSON Pointer?" name="1">
              <n-card title="Example">
              <p>A JSON Pointer is a list of zero-to-many tokens, each prefixed by <code>/</code>. Each token can be a string or a number. For example, given a JSON: </p>
              <div class="fragment">
                <div class="line">{</div>
                <div class="line">    "foo" : ["bar", "baz"],</div>
                <div class="line">    "pi" : 3.1416</div>
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
            </n-card>
            </n-collapse-item>
          </n-collapse>

          <component style="margin: 1rem auto; display: block;" :is="() => json_pointer_render(search_str, table_data)" />

          <div
            style="margin-top: 5px;"
            v-if="search_value?.length > 0">
            <label>JSON</label>
            <n-input
              v-model:value="search_value"
              type="textarea"
            />
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
import { NButton, NFlex, NInput, NIcon, NTable, NAutoComplete,NCollapse, NCollapseItem, NCard } from "naive-ui";
import { Play } from "@vicons/ionicons5";
import { ref, h , computed, watch} from "vue";
import JSON5 from "json5";
import json_pointer from "json-pointer";

import sidebar_left_svg from "../assets/icon/sidebar-left.svg";
import sidebar_right_svg from "../assets/icon/sidebar-right.svg";
let table_data = ref(null);
const input_str = ref(localStorage.getItem("input_str")||"");
const search_str = ref("");
const search_auto_complete_options = computed(()=>{

  const search = search_str.value == '/' ? '' : search_str.value;
  const sub_value = save_json_pointer_get(search, table_data.value);

  if(!sub_value) return []

  console.log('sub_value', sub_value)
  if(Array.isArray(sub_value)){
    return [search + '/0']
  }

  return Object.keys(sub_value).map(key => search + '/' + key)
})


const search_value = computed(()=>{
return JSON.stringify( save_json_pointer_get(search_str.value, table_data.value), null, 2 );
})

const json_table_pannels = JSON.parse(
  localStorage.getItem("json_table_pannels") ||
    JSON.stringify([
      {
        close: false,
        size: 30,
        default_size: 30,
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

async function togglePannel(index: number) {
  pannels.value[index].close = !pannels.value[index].close;

  const col_size = pannels.value.map((p) => {
    return p.close ? 0 : p.default_size;
  });

  pannels.value.forEach((x, i) => {
    x.size = size(i);
  });

  localStorage.setItem("json_table_pannels", JSON.stringify(pannels.value));

  function size(index: number) {
    const sum = col_size.reduce((a, b) => a + b, 0);

    return Math.floor((col_size[index] / sum) * 100);
  }
}

function json_render(str: string) {
  try {
    table_data.value = JSON5.parse(str);
    
    // const formatted = JSON.stringify(table_data, null, 4);
    // input_str.value = formatted;
    localStorage.setItem("input_str", str);

    search_str.value = search_str.value+''; 
  } catch (e) {
    table_data.value = null;
  }
  return table_render_click(obj2Table(table_data.value));
}


function update_search(e, json_pointer){
  e.stopPropagation();
  search_str.value = json_pointer; 
  console.log(json_pointer);
}
function table_render_click(obj, json_pointer='') {
  if (obj.type == "Array") {
    return (
      <NTable single-line={false} size="small" data-pointer={json_pointer}>
        <thead onClick={e=> update_search(e, json_pointer)}>
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

  if(obj.type == 'sameArrayField'){
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
              v.value.map(vv => <td>{table_render_click(vv.value, `${json_pointer}/${v_i}${vv.value.type == 'Primitive' ? '': '/'+vv.name}`)}</td>)
              : <td>{table_render_click(v, `${json_pointer}/${v_i}`)}</td>
            }</tr>)
            
          }
        </tbody>
      </NTable>
    );
  }

  if (obj.type == "Object") {
    return (<NTable single-line={false} size="small">
        <tr data-pointer={json_pointer} onClick={e=> update_search(e, json_pointer)}>
          <th>Key</th>
          <th>Value</th>
        </tr>
        <tbody>{
            obj.value.map(o => {
              return (
                <tr onClick={e=> update_search(e, json_pointer+`/${o.name}`)}>
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
    return <span onClick={e=> update_search(e, json_pointer)}>
      {obj.value.toString()}</span>;
}

function table_render(obj) {
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

  if(obj.type == 'sameArrayField'){
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
function obj2Table(obj: any) {
  if (!obj) return "null";
  if (obj === "") return "string";

  if (Array.isArray(obj)) {
    if(sameArrayField(obj))
    console.log('sameArrayField', obj.map((o) => obj2Table(o)))

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



function isPrimitive(str) {
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


function save_json_pointer_get(pointer_str, target_obj ){
  try{
    const pointer_obj = json_pointer.get(target_obj, pointer_str);
    console.log('save_json_pointer_get', pointer_obj)
    return pointer_obj;
  }catch(e){
    return undefined;
  }
}
function json_pointer_render(pointer_str, target_obj){
  try{
    if(!target_obj) return <p>empty object</p>
    const pointer_obj = json_pointer.get(target_obj, pointer_str);
    return table_render(obj2Table(pointer_obj));
  }
  catch(e){
    return <p>{e.toString()}</p>
  }

}

function sameArrayField(arr: Array<any>) {
  return arr
    .map(obj => Object.keys(obj).join('|'))
    .every((val, i, arr) => val === arr[0] )
    && !Array.isArray(arr[0])
    && arr.length > 1
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

td:first-child {
  width: 10%;
}
div.fragment{
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
</style>
