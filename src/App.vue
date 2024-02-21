<template>
  <router-view></router-view>
</template>

<script>
import {useUserStore} from './store/UserStore'
import FrontSideApiService from "@/services/FrontSideApiService";
import {onMounted} from "vue";

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore();

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const oauth = urlParams.get('oauth');

      if (oauth === 'true') {
        const response = await FrontSideApiService.oauthSuccess('http://localhost/api', {params: {oauth}});
        localStorage.setItem('token', response.data.token);
        userStore.setToken(response.data.token);
        await userStore.localStorageAuthenticatedRequest();
        return null;
      } else if (localStorage.getItem('token')) {
        await userStore.localStorageAuthenticatedRequest();
      } else if (sessionStorage.getItem('token')) {
        await userStore.sessionStorageUserAuthenticated();
      }
    });

  }
}
</script>

<style>
@media (max-width: 995px) {
  div, div *:not(h1):not(h2):not(h3):not(i):not(footer):not(.footer *):not(a) {
    font-size: 1rem;
  }
}
</style>