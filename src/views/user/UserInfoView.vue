<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-card style="margin-right: 10%">
          <template #cover>
            <div>
              <img
                :style="{
                  width: '40%',
                  height: '40%',
                  textAlign: 'center',
                }"
                alt="dessert"
                :src="userInfo.userAvatar"
              />
            </div>
          </template>
          <a-card-meta>
            <template #description>
              <a-descriptions
                style="margin-top: 20px"
                :data="userInfoData"
                title="个人信息"
                :column="1"
              />
            </template>
          </a-card-meta>
        </a-card>
        <a-divider size="0" />
      </a-col>
      <a-col :md="12" :xs="24">
        <a-tabs v-model:active-key="changeTab" type="line">
          <a-tab-pane key="updateUserInfo">
            <template #title>
              <icon-storage style="color: #007bff; margin-right: 5px" />修改信息
            </template>
            <a-form
              :model="form"
              size="large"
              @submit="handleSubmit"
              label-align="left"
              auto-label-width
              style="max-width: 80%"
            >
              <a-form-item
                label="头像"
                field="userAvatar"
                :validate-trigger="['change', 'input']"
              >
                <a-upload
                  :action="uploadFile"
                  :fileList="file ? [file] : []"
                  :show-file-list="false"
                  @change="onChange"
                >
                  <template #upload-button>
                    <div
                      :class="`arco-upload-list-item${
                        file && file.status === 'error'
                          ? ' arco-upload-list-item-error'
                          : ''
                      }`"
                    >
                      <div
                        class="arco-upload-list-picture custom-upload-avatar"
                        v-if="file && file.url"
                      >
                        <img :src="file.url" />
                        <div class="arco-upload-list-picture-mask">
                          <IconEdit />
                        </div>
                        <a-progress
                          v-if="
                            file.status === 'uploading' && file.percent < 100
                          "
                          :percent="file.percent"
                          type="circle"
                          size="mini"
                          :style="{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translateX(-50%) translateY(-50%)',
                          }"
                        />
                      </div>
                      <div class="arco-upload-picture-card" v-else>
                        <div class="arco-upload-picture-card-text">
                          <IconPlus />
                          <div style="margin-top: 10px; font-weight: 600">
                            Upload
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-upload>
              </a-form-item>
              <a-form-item
                label="昵称"
                field="userName"
                :validate-trigger="['change', 'input']"
                :rules="[
                  { minLength: 2, message: '昵称长度不能小于2位' },
                  { maxLength: 16, message: '昵称长度不能超过16位' },
                ]"
              >
                <a-input v-model="form.userName" placeholder="昵称 (2~16位)" />
              </a-form-item>
              <a-form-item
                label="个人简介"
                field="userProfile"
                :validate-trigger="['change', 'input']"
                :rules="[{ maxLength: 200, message: '长度不能超过200' }]"
              >
                <a-textarea
                  v-model="form.userProfile"
                  placeholder="简介 (最大200)"
                  aria-required="true"
                />
              </a-form-item>

              <a-form-item field="autoLogin" style="text-aligt: center">
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" style="width: 320px"
                  >更新信息</a-button
                >
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="answer">
            <template #title>
              <icon-experiment style="color: #007bff; margin-right: 5px" />
              本人题解
            </template>
            <QuestionMyAnswer :user-id="userInfo.id" />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps, reactive } from "vue";
import { useStore } from "vuex";
import QuestionMyAnswer from "@/components/QuestionMyAnswer.vue";
import {
  OpenAPI,
  OssControllerService,
  User,
  UserControllerService,
  UserLoginRequest,
  UserUpdateMyRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

interface Props {
  id: string;
}
const store = useStore();
const userInfo = ref<User>(store.state?.user.loginUser);
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const router = useRouter();
const terminalOpen = ref<boolean>(false);
const activeTerminal = ref<string>("1");
const file = ref();
const uploadFile = ref(OpenAPI.BASE + "/api/user/ossController/upload");
const changeTab = ref<string>("updateUserInfo");

// const loadData = () => {
//   userInfo.value = store.state?.user.loginUser;
//   console.log("userInfo", userInfo.value);
// };

const userInfoData = [
  {
    label: "用户昵称",
    value: userInfo.value.userName,
  },
  {
    label: "用户角色",
    value: userInfo.value.userRole,
  },
  {
    label: "用户介绍",
    value: userInfo.value.userProfile,
  },
];
/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  // loadData();
});
const form = reactive({
  ...userInfo.value,
} as UserUpdateMyRequest);

const onChange = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};
const onProgress = (currentFile: any) => {
  file.value = currentFile;
};

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async (values: any, errors: any) => {
  if (values?.errors) {
    return;
  }
  if (form.userName == "") {
    message.error("请输入昵称！");
    return;
  }
  if (form.userProfile == "") {
    message.error("请输入简介！");
    return;
  }
  if (file.value.url !== "") {
    form.userAvatar = file.value.url;
  }
  const res = await UserControllerService.updateMyUserUsingPost(form);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    location.reload();
    message.success("修改成功");
  } else {
    message.error("修改失败，" + res.message);
  }
};
const handleUploadFile = async (files: any) => {
  const res = await OssControllerService.uploadUsingPost(files);
  console.log(res);
  console.log(res.data);

  return [
    {
      title: "图片",
      url: res.data,
    },
  ];
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
