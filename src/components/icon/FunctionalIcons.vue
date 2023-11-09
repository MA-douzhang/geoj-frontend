<template>
  <icon-font :type="props.iconName" :size="21" />
</template>

<script setup lang="ts">
import { Icon } from "@arco-design/web-vue";
import { defineProps, withDefaults } from "vue/dist/vue";
/**
 * 定义组件属性类型
 */
interface Props {
  iconName: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  iconName: () => "icon-person",
});

const IconFont = Icon.addFromIconFontCn({
  src: "https://at.alicdn.com/t/c/font_4324200_34plsetgby1.js",
});
</script>
