<template>
  <svg
    t="1704107454537"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7275"
    :width="size"
    :height="size"
    :fill="color"
  >
    <path
      d="M512 96C282.624 96 96 282.624 96 512s186.624 416 416 416 416-186.624 416-416S741.376 96 512 96z m0 768c-194.08 0-352-157.92-352-352s157.92-352 352-352 352 157.92 352 352-157.92 352-352 352z"
      p-id="7276"
    ></path>
    <path
      d="M466.816 324.96A32 32 0 0 0 416 350.848v339.776a32 32 0 0 0 50.816 25.856l233.6-169.888a32 32 0 0 0 0-51.776l-233.6-169.856z"
      p-id="7277"
    ></path>
  </svg>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

interface IIconProps {
  size?: string | number;
  color?: string;
}

withDefaults(defineProps<IIconProps>(), {
  size: 16,
  color: "#333333",
});
</script>

<style scoped></style>
