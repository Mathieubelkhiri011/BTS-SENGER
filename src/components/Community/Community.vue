<template>
  <div class="community">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input v-model="search"
            class="prompt"
            type="text"
            placeholder="Rechercher un utilisateur"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="users">
      <div class="user" @click="ToggleSelectedUser(user.username)" v-for="user in FilterUsers" :key="user.username">
        <img v-bind:src=user.picture_url />
        <!-- <span class="available">  -->
          <span>
          {{ user.username }}
         </span>
      </div>    
    </div>
    <div class="actions">
      <button class="ui primary big button" @click="openConversation">
        <i class="conversation icon"></i>
        <span>
          Ouvrir la conversation (2)
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Community",
  data() {
    return { 
      search : "",
      selectedUsers: []
    };
  },
  methods: {
    ...mapActions(["createOneToOneConversation"]),
    
    ToggleSelectedUser(username) {
      this.selectedUsers.push({ username: username });
      console.log(this.selectedUsers)
    },  
    openConversation() {
      let promise = this.createOneToOneConversation("Alice");

      promise.finally(() => {
        console.log("Conversation ouverte !");
      });
    }
  },
  computed: {
    ...mapGetters(["users"]),
    FilterUsers() {
      return this.users.filter((user) => user.username.toLowerCase().includes(this.search.toLowerCase()))
      //Pour la sélection, utiliser ArrayMap pour remplir le tableau selectedUser 
    },
  }
};
</script>

<style src="./Community.css" scoped />
