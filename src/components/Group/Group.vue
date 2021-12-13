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
        title="Enlever de la conversation"
        @click="RemoveUser(user.username)"
        class="circular times icon link"
        style=""
      ></i>
    </div>
    <div class="spanner">
      <hr />
      <span>Communauté</span>
      <hr />
    </div>
    <div class="user" v-for="user in FilterUsers" :key="user.token">
      <img v-bind:src="user.picture_url" />
      <span> {{ user.username }} </span>
      <i title="Ajouter à la conversation" @click="addUser(user.username)" class="circular plus icon link"></i>
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
      UsersConversations: [],
      usernameUserConnecte: localStorage.getItem('username')
    };
  },
  computed: {
    ...mapGetters(['users', 'conversation']),

    FilterUsers() {
      let FilterUsers = [];
      FilterUsers = this.users.map(user => ({
        ...user
      }));
      FilterUsers = this.users.filter(
        user => !this.conversation.participants.find(element => element === user.username)
      );
      return FilterUsers.filter(user => user.username.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  methods: {
    ...mapActions([]),

    AllUsersConversations() {
      this.UsersConversations = this.users.map(user => ({
        ...user
      }));
      return this.UsersConversations.filter(user =>
        this.conversation.participants.find(element => element === user.username)
      );
    },

    addUser(username) {
      this.conversation.participants.push(username);
      console.log(this.conversation.participants, ' : ', username);
      this.UsersConversations = this.users.filter(user =>
        this.conversation.participants.find(element => element === user.username)
      );
      this.UsersConversations = this.UsersConversations.filter(
        user1 => !this.UsersConversations.find(element => user1.username === this.usernameUserConnecte)
      );
    },

    RemoveUser(username) {
      let i = 0;

      for (const key of this.conversation.participants) {
        if (key === username) {
          this.conversation.participants.splice(i, 1);
        }
        i = i + 1;
      }

      this.UsersConversations = this.users.filter(user =>
        this.conversation.participants.find(element => element === user.username)
      );
      this.UsersConversations = this.UsersConversations.filter(
        user1 => !this.UsersConversations.find(element => user1.username === this.usernameUserConnecte)
      );
    },

    print() {
      this.UsersConversations = this.users.filter(user =>
        this.conversation.participants.find(element => element === user.username)
      );
      this.UsersConversations = this.UsersConversations.filter(
        user1 => !this.UsersConversations.find(element => user1.username === this.usernameUserConnecte)
      );
    }
  },
  mounted() {
    this.UsersConversations = this.users.filter(user =>
      this.conversation.participants.find(element => element === user.username)
    );
    this.UsersConversations = this.UsersConversations.filter(
      user1 => !this.UsersConversations.find(element => user1.username === this.usernameUserConnecte)
    );
  }
};
</script>

<style src="./Group.css" scoped />
