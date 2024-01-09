<template>
  <div style="margin-left: 10px; margin-right: 10px">
    <a-typography>
      <a-typography-title :heading="4" style="font-weight: bold">
        {{ props.question.title }}
      </a-typography-title>
      <a-space
        ><span v-if="props.question.difficulty === 1">
          <a-tag color="gray" style="border-radius: 10px; color: #00af9b"
            >简单</a-tag
          >
        </span>
        <span v-else-if="props.question.difficulty === 2">
          <a-tag color="gray" style="border-radius: 10px; color: #ffb800"
            >中等</a-tag
          >
        </span>
        <span v-else-if="props.question.difficulty === 3">
          <a-tag color="gray" style="border-radius: 10px; color: #ff2d55"
            >困难</a-tag
          >
        </span>
        <a-tag checkable style="border-radius: 10px" @click="scrollToTags">
          <icon-tag
            :size="15"
            style="margin-right: 5px; transform: scaleX(-1)"
          />
          相关标签
        </a-tag>
        <a-tag checkable style="border-radius: 10px">
          <icon-bulb :size="15" style="margin-right: 5px" />
          提示
        </a-tag>
      </a-space>

      <div style="margin-left: 2px">
        <a-typography-title :heading="5" style="font-weight: bold">
          判题条件
        </a-typography-title>
        <a-descriptions :column="{ xs: 1, md: 2, lg: 3 }">
          <a-descriptions-item label="时间限制:">
            <a-tag color="gray" style="border-radius: 10px">
              {{ props.question.judgeConfig?.timeLimit ?? 0 }} MS
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="内存限制:">
            <a-tag color="gray" style="border-radius: 10px">
              {{ props.question.judgeConfig?.memoryLimit ?? 0 }} K
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="堆栈限制:">
            <a-tag color="gray" style="border-radius: 10px">
              {{ props.question.judgeConfig?.stackLimit ?? 0 }} K
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <MdViewer :value="props.question.content || ''" />
    </a-typography>
    <div>
      <a-divider />

      <a-space :size="5" style="height: 20px">
        <p style="color: #262626bf">通过次数</p>
        <b>{{ props.question.acceptedNum }}</b>
        <a-divider direction="vertical" />
        <p style="color: #262626bf">提交次数</p>
        <b>{{ props.question.submitNum }}</b>
        <a-divider direction="vertical" />
        <p style="color: #262626bf">通过率</p>
        <a-statistic
          :value="
            props.question.submitNum
              ? (parseFloat(String(props.question.acceptedNum)) /
                  parseFloat(String(props.question.submitNum))) *
                100
              : 0
          "
          :precision="2"
          :value-style="{
            color: '#262626',
            fontSize: '14px',
            fontWeight: 'bold',
          }"
        >
          <template #suffix>%</template>
        </a-statistic>
      </a-space>
      <a-divider />
      <div id="tagIndex">
        <div
          style="display: flex; justify-content: space-between; height: 20px"
          @click="rotateIconTags"
        >
          <div style="display: flex; align-items: center">
            <icon-tag
              :size="15"
              style="margin-right: 5px; transform: scaleX(-1)"
            />
            <span>相关标签</span>
          </div>
          <icon-down
            :size="16"
            class="icon-down"
            :class="{
              'rotate-clockwise': rotatedTags,
              'rotate-counterclockwise': !rotatedTags,
            }"
          />
        </div>
        <transition name="tag-list">
          <div v-if="rotatedTags" class="tag-list" ref="tagList">
            <a-space style="margin-left: 18px">
              <a-tag
                v-for="(tag, index) of props.question.tags"
                :key="index"
                color="gray"
                style="border-radius: 10px"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </div>
        </transition>
      </div>
      <a-divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import MdViewer from "@/components/MdViewer.vue";
import { withDefaults, defineProps, ref } from "vue";

interface Props {
  question?: any;
}

const props = withDefaults(defineProps<Props>(), {
  question: () => [],
});

const rotatedTags = ref(false);
const rotateIconTags = () => {
  rotatedTags.value = !rotatedTags.value;
};

/**
 * 滚动到标签
 */
const scrollToTags = () => {
  const anchor: any = document.getElementById("tagIndex");
  anchor.scrollIntoView();
  rotatedTags.value = true;
};
</script>

<style scoped>
.icon-down {
  color: #dfdfdf;
  cursor: pointer;
}

.icon-down:hover {
  color: #c7c7c7;
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

.tag-header {
  display: flex;
  justify-content: space-between;
  height: 20px;
  cursor: pointer;
}

.tag-header-content {
  display: flex;
  align-items: center;
}

.tag-list {
  overflow: hidden;
}

.tag-list-enter-active,
.tag-list-leave-active {
  transition: max-height 0.5s;
}

.tag-list-enter,
.tag-list-leave-to {
  max-height: 0;
}
</style>
