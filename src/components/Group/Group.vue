<template>
  <div class="group">
    <div class="ui fluid search">
      <div class="ui icon input">
        <input v-model="search" type="text" placeholder="Rechercher un utilisateur" class="prompt" /><i
          class="search icon"
        ></i>
      </div>
    </div>
    <div class="spanner">
      <hr />
      <span>Participants</span>
      <hr />
    </div>
    <div class="user" v-for="user in UsersConversations" :key="user.username">
      <img v-bind:src="user.picture_url" />
      <span>
        {{ user.username }} <br /><i class="nickname">{{ user.username }}</i></span
      >
      <i title="Modifier le surnom" class="circular quote left link icon"></i>
      <i
        v-if="UsersConversations.length > 3"
        title="Enlever de la conversation"
        @click="RemoveUser(user)"
        class="circular times icon link"
        style=""
      ></i>
    </div>
    <div v-if="UsersConversations.length > 2">
      <div class="spanner">
        <hr />
        <span>Communauté</span>
        <hr />
      </div>
      <div class="user" v-for="user in FilterUsers" :key="user.token">
        <img v-bind:src="user.picture_url" />
        <span> {{ user.username }} </span>
        <i title="Ajouter à la conversation" @click="addUser(user)" class="circular plus icon link"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Group',
  data() {
    return {
      search: '',
      usernameUserConnecte: localStorage.getItem('username')
    };
  },
  computed: {
    ...mapGetters(['users', 'conversation']),

    UsersConversations() {
      console.log('this.conversation.participants : ', this.conversation.participants);
      return this.users.filter(user => this.conversation.participants.find(element => element === user.username));
    },

    FilterUsers() {
      let FilterUsers = [];
      FilterUsers = this.users.map(user => ({
        ...user
      }));
      FilterUsers = this.users.filter(
        user => !this.conversation.participants.find(element => element === user.username)
      );
      return FilterUsers;
    }
  },
  methods: {
    ...mapActions(['addParticipant', 'removeParticipant']),

    addUser(user) {
      let promise = this.addParticipant({
        conversation: this.conversation,
        user: user
      });
      promise.finally(() => {
        console.log('Participant ajouté !');
      });
    },

    RemoveUser(user) {
      let promise = this.removeParticipant({
        conversation: this.conversation,
        user: user
      });
      promise.finally(() => {
        console.log('Participant retiré !');
      });
    },

    print() {}
  }
};
</script>

<style src="./Group.css" scoped />
