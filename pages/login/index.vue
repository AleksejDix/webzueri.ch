<template>
  <div>
    <div v-if="login">
      <h1>Login</h1>
      <form>
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Password">
        <button @click.prevent="logIn">Login</button>
        <button @click.prevent="toggleForm">Register</button>
      </form>
    </div>
    <div v-else>
      <h1>Register</h1>
      <form>
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Password">
        <button @click.prevent="registerUserWithEmail">Register</button>
        <button @click.prevent="toggleForm">Login</button>
      </form>
    </div>
    <button @click="logOut">Log Out</button>
    <br>
    <button @click="loginWithGoogle">Login with Google</button>
    <br>
    <button @click="loginWithGithub">Login with GitHub</button>
    <br>
    <button @click="loginWithTwitter">Login with Twitter</button>

  </div>
</template>

<script>
import firebase from '../../services/fireinit.js';
export default {
  data: function() {
    return {
      login: true,
      email: null,
      password: null
    };
  },
  methods: {
    toggleForm() {
      this.login = !this.login;
    },
    registerUserWithEmail() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => console.log('all good'))
        .catch(error => console.log(error.message));
    },
    logOut() {
      firebase.auth().signOut();
    },
    logIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => console.log('all good'))
        .catch(error => console.log(error.message));
    },
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .catch(error => console.log(error.message));
    },
    loginWithGithub() {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .catch(error => console.log(error.message));
    },
    loginWithTwitter() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .catch(error => console.log(error.message));
    }
  }
};
</script>

<style scoped>
</style>