<template>
  <div class="group">
    <div class="ui fluid search">
      <div class="ui icon input">
        <input v-model="search"
          type="text"
          placeholder="Rechercher un utilisateur"
          class="prompt"
        /><i class="search icon"></i>
      </div>
    </div>
    <div class="spanner">
      <hr />
      <span>Participants</span>
      <hr />
    </div>
    <div class="user" v-for="user in UsersConversations" :key="user.username">
      <img v-bind:src=user.picture_url />
      <span> {{ user.username }} <br /><i class="nickname"></i></span>
      <i title="Modifier le surnom" class="circular quote left link icon"></i>
      <i title="Enlever de la conversation" class="circular times icon link" style=""></i>
    </div>
    <div class="spanner">
      <hr />
      <span>Communauté</span>
      <hr />
    </div>
    <div class="user" v-for="user in FilterUsers" :key="user.token">
      <img v-bind:src=user.picture_url />
      <span> {{ user.username }} </span>
      <i title="Ajouter à la conversation" @click="print()" class="circular plus icon link"></i>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Group",
  data() {
    return {
      search: "",
      UsersConversations : []
    };
  },
  computed: {
    ...mapGetters(["users", "conversation"]),

    FilterUsers() {
      let FilterUsers =[];
      FilterUsers = this.users.map(user => ({
        ...user
      }));
      return  FilterUsers.filter((user) => user.username.toLowerCase().includes(this.search.toLowerCase()))
    },
  },
  methods: {
    ...mapActions([]),

    AllUsersConversations() {
      this.UsersConversations = this.users.map(user => ({
        ...user
      }));
      console.log(this.UsersConversations);
      return this.UsersConversations.filter((user) => this.conversation[0].participants.find(element => element === user.username));
    },


    print(){
      this.UsersConversations = this.users.map(user => ({
        ...user
      }));
      this.UserConversation = this.UsersConversations.filter((user) => this.conversation[0].participants.find(element => element === user.username));
      console.log("tessssst", this.UserConversation[1].username);
    }
  },
  mounted(){
      this.UsersConversations = this.users.filter((user) => this.conversation[0].participants.find(element => element === user.username));
  }
};
</script>

<style src="./Group.css" scoped />