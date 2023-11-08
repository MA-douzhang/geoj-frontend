<template>
  <div>
    <div style="margin: 5px 16px">
      <a-button @click="getSubmit">
        <template #icon>
          <icon-close class="closeCss" />
        </template>
      </a-button>
      <a-divider style="margin: 5px 0 0 0" />
    </div>
    <div v-bind:style="{ height: props.logHeight, overflow: 'scroll' }">
      <template v-if="questionSubmit && !loading">
        <div style="margin: 16px 20px">
          <div style="display: flex">
            <a-avatar size="large" :image-url="currentUser?.userAvatar" />
            <div style="margin-left: 4px; flex: 1 1 auto">
              <div style="font-weight: 600">{{ currentUser?.username }}</div>
              <div style="font-size: 11px; color: #3c3c4399">
                {{
                  moment(
                    new Date(questionSubmit?.createTime).toISOString()
                  ).format("YYYY-MM-DD HH:mm:ss")
                }}
              </div>
            </div>

            <div style="float: right">
              <span
                style="font-size: 12px; color: #3c3c4399; margin-right: 16px"
              >
                通过测试用例：
                <span style="font-size: 16px; color: black; font-weight: 600">
                  {{ questionSubmit.judgeInfo.pass }} /
                  {{ questionSubmit.judgeInfo.total }}
                </span>
              </span>

              <a-button
                size="large"
                type="text"
                v-bind:style="{
                  color: submitStatusColor.get(questionSubmit.status),
                  fontSize: 18,
                  padding: '0 16px',
                }"
              >
                <template #icon>
                  <!--                  <icon-check-circle />-->

                  {{ submitStatusIcon.get(questionSubmit.status) }}
                </template>
                {{ submitStatusText.get(questionSubmit.status) }}
              </a-button>
            </div>
          </div>

          <div style="margin-top: 16px">
            <Tag
              style="border-radius: 16px; padding: 0 12px"
              color="processing"
              >{{ languageLabel.get(questionSubmit.language) }}</Tag
            >
            <template v-if="questionSubmit.judgeInfo.time">
              <a-tag style="border-radius: 16px; padding: 0 12px" color="green">
                <template #icon>
                  <!--            <ClockCircleOutlined/>-->
                </template>
                {{ questionSubmit.judgeInfo.time }} ms
              </a-tag>
            </template>
            <template v-if="questionSubmit.judgeInfo.memory">
              <a-tag
                style="border-radius: 16px; padding: 0 12px"
                color="processing"
              >
                <template #icon>
                  <!--            <ClockCircleOutlined/>-->
                </template>
                {{ questionSubmit.judgeInfo.memory }} ms
              </a-tag>
            </template>
          </div>

          <template v-if="questionSubmit.status === SUBMIT_STATUS.FAILED">
            <div
              style="
                margin-top: 16px;
                border-radius: 8px;
                background-color: #000a2008;
                padding: 16px;
                font-size: 13px;
                color: #262626bf;
              "
            >
              <div>错误信息</div>
              <a-divider style="margin: 4px 0" />
              <div v-bind:style="{ color: Color.HARD }">
                {{ questionSubmit.judgeInfo.message }}
              </div>
              <template
                v-if="
                  questionSubmit.judgeInfo.status ===
                  JUDGE_INFO_STATUS['Wrong Answer']
                "
              >
                <div style="margin-top: 16px">
                  <div>最后执行输入</div>
                  <Divider style="margin: 4px 0" />
                  <div style="color: black">
                    {problemSubmit.judgeInfo.input}
                  </div>

                  <div style="margin-top: 16px">预期输出</div>
                  <a-divider style="margin: 4px 0" />
                  <div v-bind:style="{ color: Color.EASY }">
                    {{ questionSubmit.judgeInfo.expectedOutput }}
                  </div>

                  <div style="margin-top: 16px">实际输出</div>
                  <a-divider style="margin: 4px 0" />
                  <div v-bind:style="{ color: Color.HARD }">
                    {{ questionSubmit.judgeInfo.output }}
                  </div>
                </div>
              </template>
            </div>
          </template>
          <MdEditor
            :previewOnly="true"
            :value="`\`\`\`\n${questionSubmit?.code}\n\`\`\`` || ''"
            editorId="log"
          />
          <div style="margin: 16px 20px">
            <a-skeleton paragraph="rows: 10" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/vue-next";
import moment from "moment";
import { ref, withDefaults, defineProps, watchEffect } from "vue";
import { useStore } from "vuex";
import {
  QuestionSubmitControllerService,
  QuestionSubmitVO,
} from "../../generated";
import useState from "@arco-design/web-vue/es/_hooks/use-state";
import {
  Color,
  JUDGE_INFO_STATUS,
  languageLabel,
  SUBMIT_STATUS,
  submitStatusColor,
  submitStatusIcon,
  submitStatusText,
} from "../utils/constants";
import MdEditor from "@/components/MdEditor.vue";

/**
 * 定义组件属性类型
 */
interface Props {
  targetSubmitId: number;
  logHeight: string;
  afterClose: () => void;
}
const store = useStore();
const currentUser = store.state.user.loginUser;
const questionSubmit = ref<QuestionSubmitVO>();
const loading = ref<boolean>(true);

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  targetSubmitId: () => 0,
  logHeight: () => "60vh",
  afterClose: () => {
    console.log("关闭");
  },
});

watchEffect(() => {
  console.log("初始化成功", props.targetSubmitId);
  if (props.targetSubmitId) {
    QuestionSubmitControllerService.getProblemSubmitVoByIdUsingGet(
      props.targetSubmitId
    ).then((res) => {
      if (res.code === 0) {
        loading.value = false;
        questionSubmit.value = res.data;
        console.log("初始化成功", questionSubmit);
      }
    });
  }
});
const getSubmit = () => {
  if (props.targetSubmitId) {
    QuestionSubmitControllerService.getProblemSubmitVoByIdUsingGet(
      props.targetSubmitId
    ).then((res) => {
      if (res.code === 0) {
        loading.value = false;
        questionSubmit.value = res.data;
        console.log("初始化成功", questionSubmit);
      }
    });
  }
};
const closeDetail = () => {
  console.log("关闭");
  props.afterClose();
};
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}

.closeCss {
  color: rgb(140, 140, 140);
  cursor: pointer;
  :hover {
    color: black;
  }
}
</style>
