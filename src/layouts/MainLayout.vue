<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />
          <q-toolbar-title>
            {{ title }}
          </q-toolbar-title>
          <q-btn-dropdown color="primary" class="no-shadow" push no-caps @click="onMainClick"
            label="Opciones">
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="72px" @click="clickChangeImageProfile" class="cursor-pointer">
                  <img :src="srcProfile">
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ name }}</div>
                <div class="text-subtitle1 q-mb-xs">{{ roleSesion }}</div>
                <q-btn
                  color="primary"
                  label="Cambiar imagen de perfil"
                  push
                  size="sm"
                  v-close-popup
                  @click="clickChangeImageProfile"
                />
                <q-btn
                  color="primary"
                  label="Cambiar contraseña"
                  push
                  size="sm"
                  class="q-mt-sm"
                  v-close-popup
                  @click="clickChangePassword"
                />
                <q-btn
                  color="primary"
                  label="Cerrar sesión"
                  push
                  size="sm"
                  class="q-mt-sm"
                  v-close-popup
                  @click="clickLogOut"
                />
              </div>
            </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          <img src="~/assets/logo-rectangle.png" width="250" class="q-mr-auto q-ml-auto">
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @changeMenu="changeMenu" />
      </q-list>
      <q-item-label header class="text-grey-8 text-center q-mt-md">
        {{ versionApp }}
      </q-item-label>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <form-change-password
      v-if="showModalChangePassword"
      v-model="showModalChangePassword"/>
    <form-change-image-profile
      v-if="showModalChangeImageProfile"
      v-model="showModalChangeImageProfile"
      :src="srcProfile"/>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EssentialLink from 'components/common/EssentialLink.vue';
import FormChangePassword from 'components/user/FormChangePassword.vue';
import FormChangeImageProfile from 'components/user/FormChangeImageProfile.vue';
import configurationTypes from '../store/modules/configuration/types';

const linksData = [
  {
    title: 'Inicio',
    caption: 'Acá no hay nada por ahora',
    icon: 'home',
    link: '/home',
  },
];
const user = localStorage.getItem('user');
let roleUserSesion = 'Ayudante';
if (user) {
  const roleUser = JSON.parse(user);
  if (roleUser.role === 'admin') {
    roleUserSesion = 'Administrador';
    linksData.push(
      {
        title: 'Categorias',
        caption: 'Gestiona las categorias',
        icon: 'account_tree',
        link: '/category',
      },
      {
        title: 'Productos',
        caption: 'Gestiona los productos',
        icon: 'inbox',
        link: '/product',
      },
      {
        title: 'Usuarios',
        caption: 'Crea y modifica usuarios',
        icon: 'people',
        link: '/user',
      },
      {
        title: 'Parametros',
        caption: 'Parametros para la app',
        icon: 'settings',
        link: '/settings',
      },
    );
  } else if (roleUser.role === 'leader') {
    roleUserSesion = 'Lider';
    linksData.push(
      {
        title: 'Categorias',
        caption: 'Gestiona las categorias',
        icon: 'account_tree',
        link: '/category',
      },
      {
        title: 'Productos',
        caption: 'Gestiona los productos',
        icon: 'inbox',
        link: '/product',
      },
    );
  } else {
    roleUserSesion = 'Usuario';
  }
}

export default {
  name: 'MainLayout',
  components: {
    EssentialLink,
    FormChangePassword,
    FormChangeImageProfile,
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      roleSesion: roleUserSesion,
      title: 'Inicio',
      showModalChangePassword: false,
      showModalChangeImageProfile: false,
    };
  },
  async mounted() {
    await this.fetchConfigurations();
    localStorage.setItem('configurations', JSON.stringify(this.configurations));
    const route = linksData.find((link) => link.link === this.$route.path);
    if (route) {
      this.title = route.title;
    }
  },
  computed: {
    ...mapState(configurationTypes.PATH, [
      'configurations',
    ]),
    name() {
      let name = '';
      if (user) {
        name = JSON.parse(user).name;
      }
      return `${name.substring(0, 20)} ...`;
    },
    srcProfile() {
      let photo = '';
      if (user) {
        photo = JSON.parse(user).photo;
      }
      return `${process.env.URL_IMAGES}/profile/${photo}`;
    },
    versionApp() {
      return `Version ${process.env.LATEST_VERSION_APP}`;
    },
  },
  methods: {
    ...mapActions(configurationTypes.PATH, {
      fetchConfigurations: configurationTypes.actions.FETCH_CONFIGURATIONS,
    }),
    changeMenu(title) {
      this.title = title;
    },
    onMainClick() {
      console.log('onMainClick ...');
    },
    clickChangePassword() {
      this.showModalChangePassword = true;
    },
    clickChangeImageProfile() {
      this.showModalChangeImageProfile = true;
    },
    clickLogOut() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    },
  },
};
</script>
