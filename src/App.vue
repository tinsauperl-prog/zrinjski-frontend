<template>
  <v-app>
    <v-app-bar color="blue-darken-3" dark>
      <v-toolbar-title>APK Zrinjski Mostar</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn to="/" text>Dashboard</v-btn>
      <v-btn to="/treneri" text>Treneri</v-btn>
      <v-btn to="/grupe" text>Grupe</v-btn>
      <v-btn to="/plivaci" text>Plivači</v-btn>
      <v-btn to="/termini" text>Termini</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>