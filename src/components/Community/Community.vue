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
      <div :class="{ 'selected user' : user.isSelected}" class="user" v-for="user in FilterUsers" :key="user.username" @click="ToggleSelectedUser(user.username)">
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
    print(value){
      console.log(value);
    },
    ToggleSelectedUser(username) {
      if(this.selectedUsers.find(element => element.username === username)){
        this.selectedUsers = this.selectedUsers.filter((user) => user.username === username);
      }else{
        this.selectedUsers.push({ username: username });
      }
      //let user = this.users.find(element => element.username === username);
      let indexOfObject = this.users.findIndex(
            o => o.username === username
       );
      this.users[indexOfObject].isSelected = !this.users[indexOfObject].isSelected;
      console.log(this.users);
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
      let FilterUsers =[];
      FilterUsers = this.users.map(user => ({
        ...user,
        isSelected : this.selectedUsers.find(element => element.username === user.username)
      }));
      return  FilterUsers.filter((user) => user.username.toLowerCase().includes(this.search.toLowerCase()))
    },
  }
};
</script>

<style src="./Community.css" scoped />
