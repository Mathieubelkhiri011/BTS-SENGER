<template>
  <div class="sidebar">
    <div class="user">
      <div class="user-picture">
        <img :src="user.picture_url" class="ui circular image" />
      </div>

      <div class="user-info">
        <div class="user-info-pseudo">{{ user.username }}</div>

        <div class="user-info-status ui simple dropdown">
          <div class="available text">
            En lig
          </div>
          <i class="dropdown icon"> </i>
          <div class="menu">
            <div class="item" @click="deauthenticate">
              <i class="logout icon"> </i>
              Déconnexion
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu">
      <div class="blue button" @click="openCommunity">
        <i class="users icon"> </i>
        <br />
        <span>Communauté</span>
      </div>
      <div v-if="true" class="blue button" @click="print()">
        <i class="search icon"> </i>
        <br />
        <span>Messages</span>
      </div>
    </div>




    <div class="conversations">
      <div class="conversation">


      </div>
      <div class="conversation-search">
        <div class="ui fluid search">
          <div class="ui icon input">
            <input
            v-model="search"
              class="prompt"
              placeholder="Rechercher une conversation"
              type="text"
            />
            <i class="search icon"> </i>
          </div>
        </div>
      </div>



      <div class="conversation" v-for="laconversation in FilterConversations" :key="laconversation.id" @click="openConversation(laconversation.id)" >
        <a class="avatar">
          <img src="https://clic-igeac.org/wp-content/uploads/2021/03/group-1824145_1280.png" />
        </a>
        <div class="content">
          <span>
         <div class="title"><i class="ui small icon circle" ></i> {{ laconversation.title }} </div>
         </span>
        </div>
      </div>




    
      <div
        class="conversation available"
        title="Cha"
        @click="openConversation(0)"
      >
        <a class="avatar">
          <img src="https://source.unsplash.com/8wbxjJBrl3k/100x100" />
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title"><i class="ui small icon circle"> </i> Cha</div>
            <span class="time">01:47:50</span>
          </div>
          <div class="text">Nouvelle conversation</div>
        </div>
      </div>
      <div
        class="conversation selected"
        title="Derek"
        @click="openConversation(0)"
      >
        <a class="avatar">
          <img src="https://source.unsplash.com/FUcupae92P4/100x100" />
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title">Derek</div>
            <span class="time">01:48:00</span>
          </div>
          <div class="text">Nouvelle conversation</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      search: "",
      isActive: false
    };
  },
  methods: {
    ...mapActions(["deauthenticate"]),
    openCommunity() {
      router.push({ name: "Community" });
    },
    openMessageSearch() {
      router.push({ name: "Search" });
    },
    openConversation(id) {
      router.push({ name: "Conversation", params: { id } });
    },
     print(){
  
      console.log("tessssst", this.conversations);
    },
    activeclass(){
      this.isActive = !this.isActive;

    }

  },
  computed: {
    ...mapGetters(["user", "conversations"]),
  
    FilterConversations() {
      let FilterConversations =[];
      FilterConversations = this.conversations.map(conversation => ({
        ...conversation,
      }));
      return  FilterConversations.filter((conversation) => conversation.title.toLowerCase().includes(this.search.toLowerCase()))
    },


  }

  
};
</script>

<style scoped src="./Sidebar.css" />
