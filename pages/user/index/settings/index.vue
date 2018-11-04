<template>

  <Card>
    <h1 slot="title">Settings</h1>

    <div class="owl">

      <div>

        <div class="owl-sm ">
          <Button type="button" @click.prevent="$store.dispatch('linkGoogle')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#google" /></svg>
            Connect with Google</Button>

          <Button type="button" @click.prevent="$store.dispatch('linkGithub')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#github" /></svg>
            Connect with github
          </Button>

          <Button type="button" @click.prevent="$store.dispatch('linkTwitter')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#twitter" /></svg>
            Connect with twitter
          </Button>
        </div>

      </div>

      <div class="xl:flex -m-2">

        <div class="flex-1 p-2">
          <div class="border rounded-lg p-4">
            <UpdateProfile />
          </div>
        </div>

        <div class="flex-1 p-2">
          <div class="border rounded-lg p-4">
            <UpdateEmail />
          </div>
        </div>

        <div class="flex-1 p-2">
          <div class="border rounded-lg p-4">
            <UpdatePassword />
          </div>
        </div>

      </div>

      <div>
        <Button @click="$store.dispatch('signOut')">Sign Out</Button>
      </div>
    </div>
  </Card>

</template>

<script>
import UpdateProfile from '@/components/forms/updateProfile'
import UpdateEmail from '@/components/forms/updateEmail'
import UpdatePassword from '@/components/forms/updatePassword'
import Card from '@/components/Card'
export default {
  components: { UpdateProfile, UpdateEmail, UpdatePassword, Card },
}
</script>

