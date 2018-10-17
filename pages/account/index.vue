<template>
  <div class="bg-white">
    <h3 v-text="account"></h3>

    <div class="columns">
      <div class="one-half column centered" >
        <p>Edit Your Profile</p>
        <EditAccountForm />
      </div>
      <div class="one-half column centered">
        <div>
          <pre>{{account}}</pre>
        </div>
      </div>
      <div class="mt-4 one-half column centered">
        <button type="button" class="btn btn-danger" @click="signOut">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EditAccountForm from '~/components/account/EditAccountForm.vue'
import gql from 'graphql-tag'
import QuerySpeaker from '~/apollo/queries/speaker'

export default {
  middleware: 'authenticated',
  components: { EditAccountForm },
  computed: {
    ...mapState([
      'user',
      'account'
    ])
  },
  methods: {
    async signOut () {
      await this.$store.dispatch('userLogout')
      this.$router.push('/account/login')
    }
  },
  async mounted () {
    let user = await new Promise((resolve, reject) => {
      this.$firebase.auth().onAuthStateChanged((user) => resolve(user))
    })
    this.$store.commit('setUser', user) // setUser is mapped action from vuex
    if (user) {
      this.$router.push('/account') // if non-null user given, go to root page.
    }
  },
}
</script>
