<template>
  <div>
    <div style="margin: 5px 16px">
      <a-button @click="closeDetail">
        <template #icon>
          <icon-close class="closeCss" />
        </template>
      </a-button>
      <a-divider style="margin: 5px 0 0 0" />
    </div>
    <div v-bind:style="{ height: props.logHeight, overflow: 'scroll' }">
      <template v-if="questionAnswer && !loading">
        <div style="margin: 16px 20px">
          <div style="display: flex">
            <a-avatar size="large" :image-url="currentUser?.userAvatar" />
            <div style="margin-left: 4px; flex: 1 1 auto">
              <div style="font-weight: 600">{{ currentUser?.username }}</div>
              <div style="font-size: 11px; color: #3c3c4399">
                {{
                  moment(
                    new Date(questionAnswer?.createTime).toISOString()
                  ).format("YYYY-MM-DD HH:mm:ss")
                }}
              </div>
            </div>
          </div>

          <div style="margin-top: 16px">
            <a-space wrap align="start" class="item-tags">
              <a-tag
                v-for="(tag, index) of questionAnswer?.tagList"
                :key="index"
                color="cyan"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </div>
          <MdViewer :value="questionAnswer?.content || ''" />
          <div style="margin: 16px 20px">
            <a-skeleton paragraph="rows: 10" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { ref, withDefaults, defineProps, watchEffect, onMounted } from "vue";
import { useStore } from "vuex";
import { PostControllerService, PostVO } from "../../generated";

import MdViewer from "@/components/MdViewer.vue";

/**
 * 定义组件属性类型
 */
interface Props {
  questionAnswerId: number;
  logHeight: string;
  afterClose: () => void;
}

const store = useStore();
const currentUser = store.state.user.loginUser;
const questionAnswer = ref<PostVO>();
const loading = ref<boolean>(true);
// eslint-disable-next-line no-undef,vue/valid-define-emits
const emit = defineEmits();
/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  questionAnswerId: () => 0,
  logHeight: () => "60vh",
  afterClose: () => {
    console.log("关闭");
  },
});

watchEffect(() => {
  console.log("初始化成功", props.questionAnswerId);
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  getQuestionSubmit();
});
const getQuestionSubmit = () => {
  if (props.questionAnswerId) {
    PostControllerService.getPostVoByIdUsingGet(props.questionAnswerId).then(
      (res) => {
        if (res.code === 0) {
          loading.value = false;
          questionAnswer.value = res.data;
          console.log("初始化成功", questionAnswer);
        }
      }
    );
  }
};

const closeDetail = () => {
  console.log("关闭");
  emit("isClickIdWatch", false);
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
