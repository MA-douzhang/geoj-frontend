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
    <div
      v-bind:style="{
        overflow: 'scroll',
        overflowX: 'hidden',
      }"
    >
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
    <a-divider />
    <div style="display: flex; align-items: center">
      <icon-tag :size="15" style="margin-right: 5px; transform: scaleX(-1)" />
      <span>评论区</span>
    </div>
    <div>
      <div>
        <a-textarea
          style="
            background-color: #ffffff;
            height: 184px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px auto 15px;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          "
          v-model:model-value="commentText"
          placeholder="请输入评论..."
        ></a-textarea>
        <div style="text-align: right">
          <a-button
            type="primary"
            status="success"
            @click="addComment(questionAnswerId)"
          >
            <icon-pen-fill />
            评论
          </a-button>
        </div>
      </div>
      <a-list
        class="list-demo-action-layout"
        item-layout="horizontal"
        :bordered="false"
        :split="false"
        :data="dataList"
        :pagination-props="{
          bufferSize: 3,
          showJumper: true,
          showPageSize: true,
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total,
        }"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #item="{ item }">
          <div
            style="
              background-color: #ffffff;
              height: 184px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 10px auto 15px;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              border-radius: 10px;
            "
          >
            <a-list-item class="list-demo-item" action-layout="vertical">
              <template #actions>
                <span
                  class="action"
                  key="heart"
                  @click="onLikeChange(item.id)"
                  style="margin-left: 12px"
                >
                  <span v-if="item.hasThumb === 1 || item.hasThumb === true">
                    <icon-thumb-up-fill
                      :style="{ color: '#f53f3f' }"
                      size="15"
                    />
                  </span>
                  <span v-else style="margin-left: 12px">
                    <icon-thumb-up-fill size="15" />
                  </span>
                  {{ item.thumbNum }}
                </span>
              </template>
              <template #extra>
                <div class="image-area" v-if="item.createTime">
                  发布时间
                  {{
                    moment(new Date(item?.createTime).toISOString()).format(
                      "YYYY-MM-DD"
                    )
                  }}
                </div>
              </template>
              <a-list-item-meta>
                <template #title>
                  <h3 class="item-title" style="margin-top: -5px">
                    {{ item.username }}
                  </h3>
                </template>
                <template #description>
                  <p class="item-description">
                    {{ item.content }}
                  </p>
                </template>
                <template #avatar>
                  <a-avatar
                    shape="square"
                    style="margin-left: 15px; margin-top: -50px"
                    :image-url="item.avatarUrl"
                  >
                  </a-avatar>
                </template>
                <template>
                  <a-pagination
                    :total="total"
                    show-total
                    show-jumper
                    show-page-size
                  />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </div>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { ref, withDefaults, defineProps, watchEffect, onMounted } from "vue";
import { useStore } from "vuex";
import {
  PostCommentQueryRequest,
  PostCommentVO,
  PostControllerService,
  PostQueryRequest,
  PostVO,
  UserControllerService,
} from "../../generated";

import MdViewer from "@/components/MdViewer.vue";
import message from "@arco-design/web-vue/es/message";

/**
 * 定义组件属性类型
 */
interface Props {
  questionAnswerId: number;
  logHeight: string;
  afterClose: () => void;
}
const commentText = ref<string>("");
const store = useStore();
const currentUser = store.state.user.loginUser;
const questionAnswer = ref<PostVO>();
const loading = ref<boolean>(true);
// eslint-disable-next-line no-undef,vue/valid-define-emits
const emit = defineEmits();

const dataList = ref<PostCommentVO[]>([]);

const total = ref();

const searchParams = ref<PostCommentQueryRequest>({
  postId: 0,
  pageSize: 10, // 设置pageSize的初始值
  current: 1,
});

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

const loadData = async () => {
  const res = await PostControllerService.getPostCommentByIdUsingPost(
    (searchParams.value = {
      ...searchParams.value,
      postId: props.questionAnswerId,
    })
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败：" + res.message);
  }
};

watchEffect(() => {
  searchParams.value = {
    ...searchParams.value,
  } as never;
  loadData();
  console.log("初始化成功", props.questionAnswerId);
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  getQuestionSubmit();
  loadData();
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

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const onPageSizeChange = (pageSize: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: pageSize,
  };
};

/**
 * 发布评论
 */
const addComment = async (questionAnswerId: number) => {
  const res = await PostControllerService.addPostCommentUsingPost({
    postId: questionAnswerId,
    content: commentText.value,
  });
  if (res.code === 0) {
    message.success("评论成功");
    loadData();
    commentText.value = "";
  } else {
    message.error("加载失败：" + res.message);
  }
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
