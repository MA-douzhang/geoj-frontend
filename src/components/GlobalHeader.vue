<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/logo-removebg.png" />
            <div class="title">吉 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <!--      <img-->
      <!--        alt="logo"-->
      <!--        src="https://shiji-1258573901.cos.ap-chengdu.myqcloud.com/avatar.png"-->
      <!--      />-->
      <div>
        <a-dropdown>
          <a-button>
            {{ store.state.user?.loginUser?.userName ?? "未登录" }}
          </a-button>
          <template
            v-if="store.state.user?.loginUser?.userName !== `未登录`"
            #content
          >
            <a-doption @click="goUserInfo">个人信息</a-doption>
            <a-doption @click="logout">退出</a-doption>
          </template>
          <template v-else #content>
            <a-doption @click="login">登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();

//展示菜单的路由
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    //根据权限过滤菜单
    if (!checkAccess(store.state.user.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});

const logout = () => {
  UserControllerService.userLogoutUsingPost();
  doMenuClick("/user/login");
};

const login = () => {
  doMenuClick("/user/login");
};
/**
 * 个人主页
 */
const goUserInfo = () => {
  doMenuClick("/user/info");
};
//路由跳转
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
const selectedKeys = ref(["/"]);
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "MA_dou",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
