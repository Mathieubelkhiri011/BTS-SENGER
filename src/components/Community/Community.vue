<template>
  <div class="community">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input v-model="search" class="prompt" type="text" placeholder="Rechercher un utilisateur" />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="users">
      <div
        :class="{ 'selected user': user.isSelected }"
        class="user"
        v-for="user in FilterUsers"
        :key="user.username"
        @click="ToggleSelectedUser(user.username)"
      >
        <img v-bind:src="user.picture_url" />
        <!-- <span class="available">  -->
        <span>
          {{ user.username }}
        </span>
      </div>
    </div>
    <div class="actions">
      <button class="ui primary big button" @click="openConversation">
        <i class="conversation icon"></i>
        <span v-if="libBtnConversation === ''">
          {{ 'Ouvrir la conversation (' + this.selectedUsers.length + ')' }}
        </span>
        <span v-else>
          {{ libBtnConversation }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Community',
  data() {
    return {
      search: '',
      libBtnConversation: '',
      selectedUsers: []
    };
  },
  methods: {
    ...mapActions(['createOneToOneConversation', 'createManyToManyConversation']),
    ToggleSelectedUser(username) {
      if (this.selectedUsers.find(element => element.username === username)) {
        this.selectedUsers = this.selectedUsers.filter(user => user.username !== username);
      } else {
        this.selectedUsers.push({ username: username });
      }
    },
    openConversation() {
      this.libBtnConversation = 'Ouverture de la conversation en cours (' + this.selectedUsers.length + ')';
      let promise;
      if (this.selectedUsers.length > 1) {
        promise = this.createManyToManyConversation(this.selectedUsers.map(user => user.username));
      } else {
        promise = this.createOneToOneConversation(this.selectedUsers[0].username);
      }

      promise.finally(() => {
        console.log('Conversation ouverte !');
      });
    }
  },
  computed: {
    ...mapGetters(['users']),
    FilterUsers() {
      let FilterUsers = [];
      FilterUsers = this.users.map(user => ({
        ...user,
        isSelected: this.selectedUsers.find(element => element.username === user.username)
      }));
      return FilterUsers.filter(user => user.username.toLowerCase().includes(this.search.toLowerCase()));
    }
  }
};
</script>

<style src="./Community.css" scoped />
