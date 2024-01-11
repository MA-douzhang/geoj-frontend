<template>
  <div id="questionsView">
    <a-row class="grid-demo">
      <a-col :span="17">
        <a-form :model="searchParams" layout="inline">
          <a-form-item>
            <a-trigger position="bl" :popup-visible="displayedDifficulty">
              <a-button
                style="
                  width: 103px;
                  height: 32px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-radius: 5px;
                "
                @click="rotateIconDifficulty"
                >难度
                <icon-down
                  :size="16"
                  :class="{
                    'rotate-clockwise': rotatedDifficulty,
                    'rotate-counterclockwise': !rotatedDifficulty,
                  }"
                />
              </a-button>
              <template #content>
                <div class="demo-basic">
                  <button class="transparent-btn" @click="doDifficulty(1)">
                    <span style="color: #00af9b">简单</span>
                    <img
                      v-if="tag === 1"
                      :src="require('@/assets/对.png')"
                      alt=""
                      class="small-image"
                    />
                  </button>
                  <button class="transparent-btn" @click="doDifficulty(2)">
                    <span style="color: #ffb800">中等</span>
                    <img
                      v-if="tag === 2"
                      :src="require('@/assets/对.png')"
                      alt=""
                      class="small-image"
                    />
                  </button>
                  <button class="transparent-btn" @click="doDifficulty(3)">
                    <span style="color: #ff2d55">困难</span>
                    <img
                      v-if="tag === 3"
                      :src="require('@/assets/对.png')"
                      alt=""
                      class="small-image"
                    />
                  </button>
                </div>
              </template>
            </a-trigger>
          </a-form-item>
          <a-form-item field="title" label="名称" style="min-width: 240px">
            <a-input v-model="searchParams.title" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item field="tags" label="标签" style="min-width: 240px">
            <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="doSubmit">提交</a-button>
          </a-form-item>
        </a-form>
        <a-divider size="0" />
        <a-table
          :ref="tableRef"
          :columns="columns"
          :data="dataList"
          :pagination="{
            showTotal: true,
            pageSize: searchParams.pageSize,
            current: searchParams.current,
            total,
          }"
          @page-change="onPageChange"
        >
          <template #status="{ record }">
            <div style="width: 84px; display: flex">
              <a-avatar
                :actions="getStatus(record.id)"
                style="background-color: transparent; margin-left: -10px"
              >
                <a-trigger auto-fit-position :unmount-on-close="false"
                  ><img
                    style="width: 18px; height: 18px"
                    v-if="record.status == 3"
                    alt="avatar"
                    :src="require('@/assets/通过.png')"
                  />
                  <template #content>
                    <div class="adopt-basic">通过</div>
                  </template>
                </a-trigger>
                <a-trigger auto-fit-position :unmount-on-close="false">
                  <img
                    style="width: 18px; height: 18px"
                    v-if="record.status == 2"
                    alt="avatar"
                    :src="require('@/assets/尝试过.png')"
                  />
                  <template #content>
                    <div class="Attempted-basic">尝试过</div>
                  </template>
                </a-trigger>
              </a-avatar>
            </div>
          </template>
          <template #tags="{ record }">
            <a-space wrap>
              <a-tag
                v-for="(tag, index) of record.tags"
                :key="index"
                color="green"
                >{{ tag }}
              </a-tag>
            </a-space>
          </template>
          <template #acceptedRate="{ record }">
            {{
              `${
                record.submitNum
                  ? (record.acceptedNum / record.submitNum).toFixed(2)
                  : "0"
              }% (${record.acceptedNum}/${record.submitNum})`
            }}
          </template>
          <template #difficulty="{ record }">
            <div style="display: flex">
              <span v-if="record.difficulty === 1" style="color: #00af9b">
                简单
              </span>
              <span v-else-if="record.difficulty === 2" style="color: #ffb800">
                中等
              </span>
              <span v-else-if="record.difficulty === 3" style="color: #ff2d55">
                困难
              </span>
            </div>
          </template>
          <!--          <template #createTime="{ record }">-->
          <!--            {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
          <!--          </template>-->
          <template #optional="{ record }">
            <a-space>
              <a-button type="primary" @click="toQuestionPage(record)">
                做题
              </a-button>
            </a-space>
          </template>
        </a-table>
      </a-col>
      <a-col :span="7">
        <div class="right">
          <div class="calendar">
            <calendar-collapse>
              <template #header>
                <calendar-header />
              </template>
              <template #content>
                <calendar-week />
                <CalendarTable />
              </template>
            </calendar-collapse>
          </div>
          <div style="margin-left: 10px">
            <div
              style="
                width: 270px;
                height: 152px;
                border-radius: 10px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              "
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 16px;
                "
              >
                <span>当前进度</span>
                <div style="display: flex; justify-content: center">
                  <a-space></a-space>
                  <a-button
                    style="
                      width: 108px;
                      height: 24px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      border-radius: 5px 0 0 5px; /* 左上角和左下角为圆角 */
                      font-size: 12px; /* 调整字体大小 */
                      margin-right: 1px; /* 添加右边距 */
                    "
                    >未命名进度
                    <icon-down />
                  </a-button>
                  <a-button
                    style="
                      border-radius: 0 5px 5px 0; /* 左上角和左下角为圆角 */
                      width: 22px;
                      height: 24px;
                    "
                  >
                    <icon-settings
                      :size="20"
                      style="margin-left: -7px; margin-right: -7px"
                    />
                  </a-button>
                </div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0 20px 0 20px;
                "
              >
                <a-progress
                  type="circle"
                  :stroke-width="3"
                  :percent="
                    Number(
                      (
                        (Number(briefnessPassNum) +
                          Number(mediumPassNum) +
                          Number(difficultyPassNum)) /
                        questionCount
                      )
                        .toString()
                        .match(/^\d+(?:\.\d{0,2})?/)
                    )
                  "
                  :style="{ transform: 'scale(1.1)' }"
                  :size="'large'"
                  :color="{
                    '0%': '#FFA116',
                    '100%': '#FFA116',
                  }"
                />
                <template> {{}} </template>
                <div style="display: flex; gap: 15px; height: 68px">
                  <div style="width: 24px">
                    <span style="color: #00af9b; font-size: 12px">简单</span>
                    <div style="margin-top: 10px">{{ briefnessPassNum }}</div>
                    <a-divider :margin="4" />
                    <div style="font-size: 12px; color: #3c3c434d">
                      {{ briefnessNum }}
                    </div>
                  </div>
                  <div style="width: 24px">
                    <span style="color: #ffb800; font-size: 12px">中等</span>
                    <div style="margin-top: 10px">{{ mediumPassNum }}</div>
                    <a-divider :margin="4" />
                    <div style="font-size: 12px; color: #3c3c434d">
                      {{ mediumNum }}
                    </div>
                  </div>
                  <div style="width: 24px">
                    <span style="color: #ff2d55; font-size: 12px">困难</span>
                    <div style="margin-top: 10px">
                      {{ difficultyPassNum }}
                    </div>
                    <a-divider :margin="4" />
                    <div style="font-size: 12px; color: #3c3c434d">
                      {{ difficultyNum }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionDifficultyVO,
  QuestionQueryRequest,
  QuestionSubmitControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import CalendarCollapse from "@/views/calendar/calendar-collapse.vue";
import CalendarHeader from "@/views/calendar/calendar-header.vue";
import CalendarWeek from "@/views/calendar/calendar-week.vue";
import CalendarTable from "@/views/calendar/calendar-table.vue";

interface Questions {
  status: number | undefined;
  id: number;
  // 其他题目属性...
}
const tableRef = ref();
const rotatedDifficulty = ref(false);
const displayedDifficulty = ref(false);
const rotatedState = ref(false);
const displayedStatus = ref(false);
const tag = ref(0);

const dataList = ref<Questions[]>([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  difficulty: 0,
  pageSize: 8,
  current: 1,
});

// 简单题目数量
const briefnessNum = ref(0);
// 中等题目数量
const mediumNum = ref(0);
// 困难题目数量
const difficultyNum = ref(0);
//题目总数
const questionCount = ref(0);

// 简单题目通过数量
const briefnessPassNum = ref(0);
// 中等题目通过数量
const mediumPassNum = ref(0);
// 困难题目通过数量
const difficultyPassNum = ref(0);

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};
/**
 * 加载题目数量
 */
const loadQuestionNum = async () => {
  const briefnessRes =
    await QuestionControllerService.getQuestionCountByDifficultyUsingGet(1);
  if (briefnessRes.code == 0) {
    briefnessNum.value = briefnessRes.data as number;
    questionCount.value =
      Number(questionCount.value) + Number(briefnessNum.value);
    console.log("简单题目数量：", briefnessNum.value);
  }
  const mediumRes =
    await QuestionControllerService.getQuestionCountByDifficultyUsingGet(2);
  if (mediumRes.code == 0) {
    mediumNum.value = mediumRes.data as number;
    questionCount.value = Number(questionCount.value) + Number(mediumNum.value);
    console.log("中等题目数量：", mediumNum.value);
  }
  const difficultyRes =
    await QuestionControllerService.getQuestionCountByDifficultyUsingGet(3);
  if (difficultyRes.code == 0) {
    difficultyNum.value = difficultyRes.data as number;
    questionCount.value =
      Number(questionCount.value) + Number(difficultyNum.value);
    console.log("困难题目数量：", difficultyNum.value);
  }
  const briefnessPassRes =
    await QuestionSubmitControllerService.getQuestionDifficultyByUserIdUsingGet(
      1
    );
  if (briefnessPassRes.code == 0) {
    briefnessPassNum.value = briefnessPassRes.data as number;
    console.log("简单题目通过数量：", briefnessPassNum.value);
  }
  const mediumPassRes =
    await QuestionSubmitControllerService.getQuestionDifficultyByUserIdUsingGet(
      2
    );
  if (mediumPassRes.code == 0) {
    mediumPassNum.value = mediumPassRes.data as number;
    console.log("中等题目通过数量：", mediumPassNum.value);
  }
  const difficultyPassRes =
    await QuestionSubmitControllerService.getQuestionDifficultyByUserIdUsingGet(
      3
    );
  if (difficultyPassRes.code == 0) {
    difficultyPassNum.value = difficultyPassRes.data as number;
    console.log("困难题目通过数量：", difficultyPassNum.value);
  }
};
/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  loadQuestionNum();
});
// 开启困难按钮时，关闭其他按钮
const rotateIconDifficulty = () => {
  rotatedDifficulty.value = !rotatedDifficulty.value;
  displayedDifficulty.value = !displayedDifficulty.value;
  rotatedState.value = false;
  displayedStatus.value = false;
};
// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  // {
  //   title: "题号",
  //   dataIndex: "id",
  // },
  {
    title: "状态",
    slotName: "status",
  },
  {
    title: "题目",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "难度",
    slotName: "difficulty",
    dataIndex: "difficulty",
  },
  {
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

// 改变难度
const doDifficulty = (number: number) => {
  searchParams.value = {
    ...searchParams.value,
    difficulty: number,
  };
  tag.value = number;
  rotatedDifficulty.value = !rotatedDifficulty.value;
  displayedDifficulty.value = !displayedDifficulty.value;
};

/**
 * 1未尝试，2尝试过，3通过
 * @param id
 */
const getStatus = async (id: number) => {
  const res = await QuestionControllerService.getQuestionStatueByIdUsingGet(id);
  if (res.code === 0) {
    const index = dataList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const status = ref(res.data);
      dataList.value[index].status = status.value;
    }
  }
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
.small-image {
  width: 18px; /* 设置图像的宽度 */
  height: auto; /* 保持高度自适应 */
}

.demo-basic {
  margin-top: 4px;
  width: 120px;
  background-color: var(--color-bg-popup);
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}

.right {
  margin-left: 10px;
}

.calendar {
  display: flex;
  flex-direction: column;
  width: 260px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  margin-left: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 5px;
}

.demo-basic {
  margin-top: 4px;
  width: 120px;
  background-color: var(--color-bg-popup);
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.transparent-btn {
  width: 124px;
  height: 32px;
  background-color: transparent;
  border: none; /* 移除边框 */
  border-radius: 5px; /* 添加圆角 */
  transition: background-color 0.3s;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
}

.transparent-btn:hover {
  background-color: #f7f7f8; /* 在悬停时更改背景颜色为 #f0f0f0 */
}

.transparent-but {
  width: 124px;
  height: 32px;
  background-color: transparent;
  border: none; /* 移除边框 */
  border-radius: 5px; /* 添加圆角 */
  transition: background-color 0.3s;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  color: #262626bf;
}

.transparent-but:hover {
  background-color: #f7f7f8; /* 在悬停时更改背景颜色为 #f0f0f0 */
  color: #4e2626;
}

.transparent-butt {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: none;
  border-radius: 3px;
}

.transparent-butt:hover {
  background-color: #dedfe2;
}

.transparent-butto {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: none;
  border-radius: 3px;
  background-color: #007aff;
}

.small-image {
  width: 18px; /* 设置图像的宽度 */
  height: auto; /* 保持高度自适应 */
}

.custom-but {
  height: 43px;
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none; /* 移除边框 */
  background-color: transparent; /* 设置背景为透明 */
  color: #8a8a8e;
  cursor: pointer; /* 设置鼠标指针样式为手型 */
}

.custom-but:hover {
  color: #595959;
}

.adopt-basic {
  padding: 5px;
  width: 45px;
  height: 15px;
  background-color: var(--color-bg-popup);
  border-radius: 15px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  text-align: center;
  color: #2b2b2d;
}

.Attempted-basic {
  padding: 5px;
  width: 50px;
  height: 15px;
  background-color: var(--color-bg-popup);
  border-radius: 15px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  text-align: center;
  color: #2b2b2d;
}

.icon-down {
  transition: transform 0.2s ease;
}

.rotate-clockwise {
  animation: rotateClockwise 0.2s linear forwards;
}

.rotate-counterclockwise {
  animation: rotateCounterclockwise 0.2s linear forwards;
}

@keyframes rotateClockwise {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(180deg);
  }
}

@keyframes rotateCounterclockwise {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0);
  }
}

.outer-div {
  overflow: auto;
}

.outer-div::-webkit-scrollbar {
  width: 0.5em;
  background-color: transparent;
}

.outer-div::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>
