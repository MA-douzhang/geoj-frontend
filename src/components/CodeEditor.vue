<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    v-bind:style="{ height: props.codeHeight }"
  />
  <!--  <a-button @click="fillValue">填充值</a-button>-->
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language?: string;
  codeHeight: string;
  handleChange: (v: string) => void;
  previewOnly: boolean;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  handleChange: (v: string) => {
    console.log(v);
  },
  codeHeight: () => "65vh",
  previewOnly: false,
});

const codeEditorRef = ref();
const codeEditor = ref();

// const fillValue = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   // 改变值
//   toRaw(codeEditor.value).setValue("新的值");
// };

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  // Hover on each property to see its docs!
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: props.previewOnly,
    theme: "vs-dark",
    scrollBeyondLastLine: false,
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
    console.log("props.codeHeight", props.language);
  });
});
</script>

<style scoped></style>
