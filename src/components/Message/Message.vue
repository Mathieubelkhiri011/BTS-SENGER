<template>
  <div>
    <div class="time">{{ new Date(message.posted_at).toLocaleTimeString() }}</div>
    <div v-if="message.from === usernameUserConnecte" class="message mine">
      <div class="bubble top bottom">{{ message.content }}</div>
      <div class="reacts"></div>
      <div class="controls">
        <i title="Supprimer" class="circular trash icon"></i><i title="Editer" class="circular edit icon"></i
        ><i title="Répondre" class="circular reply icon"></i>
      </div>
    </div>
    <div v-else class="message">
      <img title="Bob" :src="users.find(e => e.username === message.from).picture_url" />
      <div class="bubble top bottom">{{ message.content }}</div>
      <div class="reacts"></div>
      <div class="controls">
        <i title="Répondre" class="circular reply icon"></i
        ><span class="react"
          ><i title="Aimer" class="circular heart outline icon"></i
          ><i title="Pouce en l'air" class="circular thumbs up outline icon"></i
          ><i title="Content" class="circular smile outline icon"></i
          ><i title="Pas content" class="circular frown outline icon"></i
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Message',
  props: ['message'],
  data() {
    return {
      groupPanel: false,
      monMessage: '',
      usernameUserConnecte: localStorage.getItem('username')
    };
  },
  computed: {
    ...mapGetters(['users'])
  }
};
</script>

<style src="./Message.css" scoped />
