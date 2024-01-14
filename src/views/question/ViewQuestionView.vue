<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs v-model:active-key="changeTab" type="line">
          <a-tab-pane key="question">
            <template #title>
              <icon-storage style="color: #007bff; margin-right: 5px" />题目描述
            </template>
            <QuestionViewPage :question="question" />
          </a-tab-pane>
          <a-tab-pane key="answer">
            <template #title>
              <icon-experiment style="color: #007bff; margin-right: 5px" />
              题解
            </template>
            <QuestionAnswer :question-id="question?.id" />
          </a-tab-pane>
          <a-tab-pane key="ai">
            <template #title>
              <icon-cloud style="color: #007bff; margin-right: 5px" />
              AI智能分析
            </template>
            <template v-if="targetSubmitId > 0">
              <a-skeleton animation v-if="aiResultLoading">
                <a-skeleton-line :rows="4" />
                <a-skeleton-line :rows="4" />
                <a-skeleton-line :rows="4" />
              </a-skeleton>
              <a-card
                v-else
                body-style="{padding: 0;display: flex; flexDirection: column;}"
                v-bind:style="{
                  flexGrow: '1',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  overflow: 'scroll',
                  height: aiHeight,
                }"
              >
                <a-card :style="{ marginBottom: '20px' }" title="解题思路">
                  {{ aiResult?.solutionIdea }}
                </a-card>
                <a-card :style="{ marginBottom: '20px' }" title="错误原因">
                  {{ aiResult?.reason }}
                </a-card>
                <a-card title="优化代码">
                  <CodeEditor
                    :previewOnly="true"
                    :value="aiResult?.codeAi || ''"
                    :language="form.language"
                  />
                </a-card>
              </a-card>
            </template>
            <template v-else> 请先提交代码 </template>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-card
          body-style="{padding: 0;display: flex; flexDirection: column; height: 100%}"
          style="flex-grow: 1; margin-bottom: 8px; border-radius: 4px"
        >
          <template v-if="targetSubmitId > 0">
            <SubmitDetail
              :target-submit-id="targetSubmitId"
              :log-height="coderHeight"
              :after-close="
                () => {
                  console.log('点击');
                }
              "
              @submitIdWatch="onReceiveMsg"
            />
          </template>
          <template v-else>
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
          </template>
        </a-card>

        <a-divider size="0" />
        <a-card body-Style="{padding: 0" style="border-radius: 4px}">
          <div v-if="terminalOpen" style="position: relative; height: 150px">
            <a-tabs v-model:activeKey="activeTerminal">
              <a-tab-pane key="1">
                <template #title>
                  <icon-check-square style="color: #02b128" />
                  测试用例
                </template>
                <span class="labelStyle">输入</span>
                <a-input
                  :style="{
                    width: '100%',
                    height: '43px',
                    borderRadius: '5px',
                    backgroundColor: '#F2F3F4',
                  }"
                  v-model="textInput"
                  placeholder="请输入测试用例"
                  allow-clear
                />
              </a-tab-pane>
              <a-tab-pane key="2">
                <template #title>
                  <icon-code style="color: #02b128" />
                  执行结果
                </template>
                <template v-if="testResult">
                  <div class="labelStyle">输入</div>
                  <div class="cardStyle">{{ testResult.input }}</div>
                  <div style="margin-top: 16px"></div>
                  <div class="labelStyle">输出</div>
                  <div class="cardStyle">{{ testResult.output }}</div>
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
          <a-divider size="0" />
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
                v-if="targetSubmitId > 0"
                size="medium"
                type="outline "
                style="width: 66px; height: 28px"
                @click="AiRun"
              >
                Ai分析
              </a-button>
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
import {
  onMounted,
  ref,
  watchEffect,
  withDefaults,
  defineProps,
  reactive,
} from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import {
  AnswerAi,
  JudgeCase,
  QuestionAiControllerService,
  QuestionControllerService,
  QuestionRunResult,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { tagsObjectList } from "../../utils/constants";
import { isUndefined } from "@arco-design/web-vue/es/_utils/is";
import SubmitDetail from "@/components/SubmitDetail.vue";
import { useStore } from "vuex";
import QuestionViewPage from "@/components/QuestionView.vue";
import QuestionAnswer from "@/components/QuestionAnswer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const store = useStore();
const question = ref<QuestionVO>();
const terminalOpen = ref<boolean>(false);
const activeTerminal = ref<string>("1");
const coderHeight = ref<string>("65vh");
const aiHeight = ref<string>("83vh");
const aiResultLoading = ref<boolean>(false);
const testResultLoading = ref<boolean>(false);
const resultLoading = ref<boolean>(false);
const textInput = ref<string>();
const testResult = ref<QuestionRunResult>();
const targetSubmitId = ref<number>(0);
const changeTab = ref<string>("question");
const aiResult = ref<AnswerAi>();
const aiText = ref<string>(
  "正确的解题代码\n" +
    "import java.util.Scanner;\n" +
    "public class Main{\n" +
    "    public static void main(String[] args){\n" +
    "        Scanner sc = new Scanner(System.in);\n" +
    "        int a= sc.nextInt();\n" +
    "        int b = sc.nextInt();\n" +
    "        System.out.println(a+b);\n" +
    "    }\n" +
    "}"
);
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
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    console.log("targetSubmitId", targetSubmitId);
    message.success("提交成功");
    targetSubmitId.value = res.data;
  } else {
    message.error("提交失败," + res.message);
  }
};

/**
 * 提交测试
 */
const doRun = async () => {
  console.log(isUndefined(textInput.value));
  if (isUndefined(textInput.value)) {
    message.error("请输入示例");
    return;
  }
  testResultLoading.value = true;
  activeTerminal.value = "2";
  const res = await QuestionSubmitControllerService.doQuestionRunUsingPost({
    ...form.value,
    input: textInput.value,
  });
  if (res.code === 0) {
    message.success("运行成功");
    testResult.value = res.data;
    testResultLoading.value = false;
  } else {
    testResultLoading.value = false;
    message.error("提交失败," + res.message);
  }
};

/**
 * 执行ai分析
 * @constructor
 */
const AiRun = async () => {
  aiResultLoading.value = true;
  message.info("正在分析，请耐心等待");
  changeTab.value = "ai";
  const res = await QuestionAiControllerService.getAnswerAiUsingPost(
    targetSubmitId.value
  );
  if (res.code === 0) {
    message.success("分析成功成功");
    aiResult.value = res.data;
    aiResultLoading.value = false;
  } else {
    aiResultLoading.value = false;
    message.error("分析失败," + res.message);
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
// 子组件触发的方法
const onReceiveMsg = (params: number) => {
  console.log("子组件触发的方法", params);
  targetSubmitId.value = params;
};
/**
 * 点击控制台按钮
 */
const clickTerminal = () => {
  terminalOpen.value = !terminalOpen.value;
  if (terminalOpen.value) {
    coderHeight.value = "45vh";
    // SubmitDetailHeight.value =;
  } else {
    // setCoderHeight("calc(100vh - 322px)");
    coderHeight.value = "65vh";
  }
};

/**
 * 获得标签颜色
 * @param tag
 */
const getTagsObjectList = (tag: string) => {
  if (tag == "" || tag == undefined || tagsObjectList.get(tag) == undefined) {
    return tagsObjectList.get("default");
  }
  return tagsObjectList.get(tag);
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

.labelStyle {
  color: #3c3c4399;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.cardStyle {
  border-radius: 0.5rem;
  background-color: #000a2008;
  padding: 6px 10px;
}
</style>
