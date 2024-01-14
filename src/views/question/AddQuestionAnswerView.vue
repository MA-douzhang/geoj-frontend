<template>
  <div id="addQuestionAnswerView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题解内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { PostControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");
const questionId = ref<any>();
let form = ref({
  questionId: questionId,
  title: "",
  tags: [],
  content:
    "\n" +
    "> Problem: []()\n" +
    "\n" +
    "\n" +
    "# 思路\n" +
    "\n" +
    "> 讲述看到这一题的思路\n" +
    "\n" +
    "# 解题方法\n" +
    "\n" +
    "> 描述你的解题方法\n" +
    "\n" +
    "# 复杂度\n" +
    "\n" +
    "时间复杂度:\n" +
    "> 添加时间复杂度, 示例： $O(n)$\n" +
    "\n" +
    "空间复杂度:\n" +
    "> 添加空间复杂度, 示例： $O(n)$\n" +
    "\n" +
    "\n" +
    "\n" +
    "# Code\n" +
    "```Java []\n" +
    "class Solution {\n" +
    "    public int[] twoSum(int[] nums, int target) {\n" +
    "        for(int i=0;i< nums.length;i++){\n" +
    "            int demo=target-nums[i];\n" +
    "            for (int n=i+1;n<nums.length;n++){\n" +
    "                if(nums[n]==demo){\n" +
    "                    return new int[]{i,n};\n" +
    "                }\n" +
    "            }\n" +
    "        }\n" +
    "    return new int[]{-1,-1};\n" +
    "    }\n" +
    "}\n" +
    "```",
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  questionId.value = route.query.id;
  console.log("questionId", questionId.value);
  if (!questionId.value) {
    return;
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await PostControllerService.updatePostUsingPost(form.value);
    if (res.code === 0) {
      message.success("更新成功");
      router.push({
        path: "/view/question/" + questionId.value,
        replace: true,
      });
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await PostControllerService.addPostUsingPost(form.value);
    if (res.code === 0) {
      message.success("创建成功");
      router.push({
        path: "/view/question/" + questionId.value,
        replace: true,
      });
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

const onContentChange = (value: string) => {
  form.value.content = value;
};
</script>

<style scoped>
#addQuestionAnswerView {
}

:deep(.bytemd-fullscreen.bytemd) {
  z-index: 100;
}
</style>
