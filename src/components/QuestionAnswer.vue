<template>
  <div style="margin: 0 auto">
    <template v-if="isClickAnswer">
      <AnswerDetail
        :question-answer-id="questionAnswerId"
        :after-close="
          () => {
            console.log('点击');
          }
        "
        @isClickIdWatch="onReceiveMsg"
      ></AnswerDetail>
    </template>
    <template v-else>
      <div style="text-align: right">
        <a-button
          type="primary"
          status="success"
          @click="addAnswer(questionId)"
        >
          <icon-pen-fill />
          发布题解
        </a-button>
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
              width: 880px;
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
                  style="margin-left: 10px"
                >
                  <span v-if="item.hasThumb === 1 || item.hasThumb === true">
                    <icon-caret-up :style="{ color: '#f53f3f' }" size="15" />
                  </span>
                  <span v-else> <icon-caret-up size="15" /> </span>
                  {{ item.thumbNum }}
                </span>
                <span class="action" key="star" @click="onStarChange(item.id)">
                  <span v-if="item.hasFavour === 1 || item.hasFavour === true">
                    <IconStarFill
                      :style="{
                        color: '#ffb400',
                      }"
                      size="15"
                    />
                  </span>
                  <span v-else>
                    <IconStar size="15" />
                  </span>
                  {{ item.favourNum }}
                </span>
              </template>
              <template #extra>
                <div class="image-area" v-if="item.cover">
                  <img
                    alt="arco-design"
                    :src="item.cover"
                    style="
                      border-radius: 10px;
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "
                  />
                </div>
              </template>
              <a-list-item-meta>
                <template #title>
                  <h3 class="item-title" style="margin-top: -5px">
                    {{ item.title }}
                  </h3>
                </template>
                <template #description>
                  <a-space wrap align="start" class="item-tags">
                    <a-tag
                      v-for="(tag, index) of item.tagList"
                      :key="index"
                      color="cyan"
                    >
                      {{ tag }}
                    </a-tag>
                  </a-space>
                  <p
                    @click="getQuestionAnswer(item.id)"
                    style="cursor: pointer"
                    class="item-description"
                  >
                    {{ item.content }}
                  </p>
                </template>
                <template #avatar>
                  <a-avatar
                    shape="square"
                    style="margin-left: 15px; margin-top: -60px"
                    :actions="getUserAvatar(item.userId, item.id)"
                    :image-url="item.userAvatar"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { defineProps, onMounted, ref, watchEffect, withDefaults } from "vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  PostControllerService,
  PostFavourControllerService,
  PostQueryRequest,
  PostThumbControllerService,
  UserControllerService,
} from "../../generated";
import message from "@arco-design/web-vue/es/message";
import AnswerDetail from "@/components/AnswerDetail.vue";

interface Props {
  questionId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  questionId: () => 0,
});
const route = useRoute();
const router = useRouter();

interface PostItem {
  id: number;
  thumbNum: number;
  favourNum: number;
  title: string;
  content: string;
  cover: string;
  userId: number;
  tagList: string[];
  userAvatar: string;
  hasThumb?: number;
  hasFavour?: number;
}

const searchParams = ref<PostQueryRequest>({
  searchText: "",
  title: "",
  tags: [],
  questionId: 0,
  pageSize: 10, // 设置pageSize的初始值
  current: 1,
  sortField: "thumbNum",
  sortOrder: "descend",
});

const dataList = ref<PostItem[]>([]);

const total = ref();
const isClickAnswer = ref<boolean>(false);
const questionAnswerId = ref<number>();
/*interface Props {
  postList: any[];
  postTotal: number;
}

/!**
 * 从搜索页父组件获取数据
 *!/
const props = withDefaults(defineProps<Props>(), {
  postList: () => [],
  postTotal: () => 0,
});*/

const loadData = async () => {
  const res = await PostControllerService.listPostVoByPageUsingPost(
    (searchParams.value = {
      ...searchParams.value,
      questionId: props.questionId,
    })
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败：" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变是触发页面的更新加载
 */
watchEffect(() => {
  searchParams.value = {
    ...searchParams.value,
    searchText: route.query.searchText,
  } as never;
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

// 初次获取点赞的状态
const getQuestionAnswer = async (postId: number) => {
  isClickAnswer.value = true;
  questionAnswerId.value = postId;
};

// 点爱心
const onLikeChange = async (postId: number) => {
  const res = await PostThumbControllerService.doThumbUsingPost({
    postId: postId,
  });
  if (res.code === 0) {
    console.log("点赞数据：", res.data);
    const index = dataList.value.findIndex((item) => item.id === postId);
    if (index !== -1) {
      const post = dataList.value[index];
      post.thumbNum += res.data === 1 ? 1 : -1;
      post.hasThumb = res.data === 1 ? 1 : -1;
    }
  } else {
    message.error("点赞失败：" + res.message);
  }
};
const onStarChange = async (postId: number) => {
  const res = await PostFavourControllerService.doPostFavourUsingPost({
    postId: postId,
  });
  if (res.code === 0) {
    console.log("收藏数据：", res.data);
    const index = dataList.value.findIndex((item) => item.id === postId);
    if (index !== -1) {
      const post = dataList.value[index];
      post.favourNum += res.data === 1 ? 1 : -1;
      post.hasFavour = res.data === 1 ? 1 : -1;
      console.log("post", post);
    }
  } else {
    message.error("收藏失败：" + res.message);
  }
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

const getUserAvatar = async (userId: number, id: number) => {
  const res = await UserControllerService.getUserVoByIdUsingGet(userId);
  if (res.code === 0 && res.data && res.data.userAvatar) {
    const index = dataList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const avatar = ref(res.data.userAvatar); // 创建新的响应式变量
      dataList.value[index].userAvatar = avatar.value; // 获取响应式变量的值并赋给数据列表
      return avatar.value; // 返回头像地址
    } else {
      console.warn(`未找到id为${userId}的用户`); // 使用console.warn显示警告信息
    }
  } else {
    console.error("头像加载失败：" + res.message); // 使用console.error显示错误信息
  }
  return undefined; // 返回undefined表示函数执行失败
};

/**
 * 添加题解
 * @param questionId
 */
const addAnswer = (questionId: number) => {
  router.push({
    path: "/add/question/answer",
    query: {
      id: questionId,
    },
  });
};

// 子组件触发的方法
const onReceiveMsg = (params: boolean) => {
  console.log("子组件触发的方法", params);
  isClickAnswer.value = params;
};
</script>

<style scoped>
.list-demo-action-layout .image-area {
  width: 190px;
  height: 150px;
  border-radius: 2px;
  overflow: hidden; /* 限制图片溢出容器 */
  margin-right: 18px;
  margin-top: 10px;
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}

.list-demo-item .item-title {
  text-align: left;
  font-weight: normal; /* 去掉加粗 */
  margin-bottom: 2px; /* 调整标题与描述之间的底部间距 */
}

.list-demo-item .item-description {
  max-width: 800px;
  height: 48px;
  text-align: left;
  margin-top: -2px; /* 调整上边距为负值 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /* 最大显示行数 */
  line-clamp: 2; /* 最大显示行数 */
  color: #3c3c4399;
}

.item-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.list-demo-action-layout .arco-list-item {
  border-radius: 4px;
}

.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}
</style>
