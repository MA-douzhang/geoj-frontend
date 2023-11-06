<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-card v-if="question" :title="question.title">
          <a-tabs default-active-key="question">
            <a-tab-pane key="question" title="题目">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-tab-pane>
            <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
            <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-card
          body-style="{padding: 0;display: flex; flexDirection: column; height: 100%}"
          style="flex-grow: 1; margin-bottom: 8px; border-radius: 4px"
        >
          <a-form :model="form" layout="inline">
            <a-form-item
              field="language"
              label="编程语言"
              style="min-width: 240px"
            >
              <a-select
                v-model="form.language"
                :style="{ width: '320px' }"
                placeholder="选择编程语言"
              >
                <a-option>java</a-option>
                <a-option>cpp</a-option>
                <a-option>go</a-option>
                <a-option>html</a-option>
              </a-select>
            </a-form-item>
          </a-form>
          <CodeEditor
            :value="form.code as string"
            :language="form.language"
            :handle-change="changeCode"
            :code-height="coderHeight"
          />
        </a-card>

        <a-divider size="0" />
        <a-card body-Style="{padding: 0" style="border-radius: 4px}">
          <div v-if="terminalOpen" style="position: relative; height: 150px">
            <a-tabs v-model="activeTerminal">
              <a-tab-pane key="1" title="测试用例">
                <template v-if="activeTerminal">
                  <div id="labelStyle">输入</div>
                  <a-textarea v-model="textInput" />
                </template>
              </a-tab-pane>
              <a-tab-pane key="2" title="执行结果">
                <template v-if="testResult">
                  <div id="labelStyle">输入</div>
                  <div id="cardStyle">{testResult.input}</div>
                  <div style="margin-top: 16px"></div>
                  <div id="labelStyle">输出</div>
                  <div id="cardStyle">{testResult.output}</div>
                </template>
                <template v-else>
                  <a-skeleton v-if="testResultLoading">
                    <a-skeleton-line :rows="4" />
                  </a-skeleton>
                  <div
                    v-else
                    style="
                      color: #3c3c4399;
                      font-weight: 500;
                      justify-content: center;
                      height: 80px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    请先执行代码
                  </div>
                </template>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div style="padding: 8px">
            <a-button
              @click="clickTerminal"
              type="text"
              size="small"
              style="width: 90px; height: 28px"
            >
              控制台
              <template #icon>
                <icon-caret-up v-if="terminalOpen" />
                <icon-caret-down v-else />
              </template>
            </a-button>
            <a-space style="float: right">
              <a-button
                size="medium"
                type="outline "
                style="width: 66px; height: 28px"
                @click="doRun"
              >
                运行
              </a-button>
              <a-button
                type="primary"
                size="medium"
                style="width: 66px; height: 28px"
                @click="doSubmit"
              >
                提交
              </a-button>
            </a-space>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, withDefaults, defineProps } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  JudgeCase,
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const terminalOpen = ref<boolean>(false);
const activeTerminal = ref<string>("1");
const coderHeight = ref<string>("65vh");
const testResult = ref<JudgeCase>();
const testResultLoading = ref<boolean>(false);

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};

/**
 * 点击控制台按钮
 */
const clickTerminal = () => {
  terminalOpen.value = !terminalOpen.value;
  if (terminalOpen.value) {
    console.log("关闭");
    coderHeight.value = "45vh";
    // setLogHeight("calc(100vh - 170px)");
  } else {
    // setCoderHeight("calc(100vh - 322px)");
    coderHeight.value = "65vh";
  }
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

#labelStyle {
  color: #3c3c4399;
  fontsize: 0.75rem;
  fontweight: 500;
  marginbottom: 8;
}
#cardStyle {
  borderradius: 0.5rem;
  backgroundcolor: #000a2008;
  padding: 6px 10px;
}
</style>
