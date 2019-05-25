<template>
  <form
    @submit.prevent="handleUpdate('proposal')"
    class="owl pb-6"
    v-bind="$attrs"
  >
    <div class="flex-1 owl overflow-y-auto overflow-x-hidden">
      <div class="flex flex-wrap -my-2 -mx-4">
        <div class="owl-sm p-2 px-4">
          <Overline>Author:</Overline>
          <user-card
            :name="data.authorDisplayName"
            :photo="data.authorPhotoURL"
          />
        </div>
      </div>
      <div class="flex flex-wrap -my-2 -mx-4">
        <div class="owl-sm p-2 px-4">
          <Overline>Created</Overline>
          <div class="whitespace-no-wrap py-1">{{data.createdAt | date }}</div>
        </div>
        <div class="owl-sm p-2 px-4">
          <Overline>Updated</Overline>
          <div class="whitespace-no-wrap py-1">{{data.updatedAt | date }}</div>
        </div>
        <div class="owl-sm p-2 px-4">
          <Overline>Submitted</Overline>
          <div class="whitespace-no-wrap py-1">{{data.submittedAt | date}}</div>
        </div>
        <div class="owl-sm p-2 px-4">
          <Overline>Approved</Overline>
          <div class="whitespace-no-wrap py-1">{{data.approvedAt | date}}</div>
        </div>
      </div>
      <div v-if="can.update">
        <div class="owl-sm">
          <Overline>Status:</Overline>
          <div
            v-if="error"
            class="text-red-dark"
          >{{error}}</div>
          <div class="inline-flex owl-x p-1 bg-grey-light rounded">
            <Button
              type="button"
              @click="handleUpdate(status)"
              size="small"
              :muted="data.status !== status"
              v-for="status in states"
              :key="status"
            >{{status}}</Button>
          </div>
        </div>
      </div>
      <div class="owl">
        <Input-simple
          :disabled="data.status === 'proposal'"
          label="Title"
          placeholder="Short Title of your speech"
          v-model="form.title"
        ></Input-simple>
        <Input-text
          :disabled="data.status === 'proposal'"
          label="Description"
          placeholder="Description of yout talk"
          v-model="form.description"
          limit="480"
        ></Input-text>
      </div>
    </div>
    <div class="sticky pin-b">
      <div class="flex justify-between owl-x">
        <Button
          type="button"
          danger="true"
          @click="isConfirmDeleteModalOpen = true"
        >delete</Button>
        <portal to="modals">
          <modal-window
            v-show="isConfirmDeleteModalOpen"
            @close="isConfirmDeleteModalOpen = false"
          >
            <div slot="title">Confirm Deletion</div>
            <div class="h-full flex flex-col owl">
              <div class="flex-1 overflow-y-auto overflow-x-hidden">
                <p>Are you sure you want to delete this? This action can't be reverted.</p>
                <div
                  v-if="error"
                  class="border-2 border-red-light rounded p-4 text-red-light bg-red-lightest font-bold text-sm"
                >{{error}}</div>
              </div>
              <div class="flex justify-end owl-x sticky pin-b">
                <Button
                  type="button"
                  muted="true"
                  @click="isConfirmDeleteModalOpen = false"
                >No, go back</Button>
                <Button
                  type="button"
                  danger="true"
                  @click="handleDelete"
                >Yes, delete</Button>
              </div>
            </div>
          </modal-window>
        </portal>
        <div>
          <Button
            v-if="data.status === 'draft'"
            type="button"
            muted="true"
            @click="handleUpdate('draft')"
          >save draft</Button>
          <Button
            v-if="data.status === 'draft'"
            type="submit"
          >submit for review</Button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import ModalWindow from "@/components/ModalWindow"

export default {
  props: ['data'],
  components: {
    ModalWindow
  },
  data () {
    return {
      states: ['draft', 'proposal', 'approved'],
      error: '',
      isConfirmDeleteModalOpen: false,
      form: {
        title: this.data.title || '',
        description: this.data.description || '',
      }
    }
  },
  computed: {
    can () {
      return this.$store.getters[`dashboard/${this.$route.params.status}-approved/can`]
    },
  },
  methods: {
    async handleDelete () {
      try {
        await this.$store.dispatch(`dashboard/${this.$route.params.status}/destroy`, this.$route.params.id)
        this.redirect()
      } catch (error) {
        this.error = error
      }
    },
    async handleUpdate (status) {
      this.error = ''
      try {
        await this.$store.dispatch(`dashboard/${this.$route.params.status}-${status}/update`, {
          id: this.$route.params.id,
          data: { ...this.form, status }
        })
        this.redirect()
      } catch (error) {
        if (error.code === 401) {
          this.error = error.message
        }
      }
    },
    redirect () {
      this.$router.push({
        name: "dashboard-index-status-index",
        params: {
          status: this.$route.params.status
        }
      })
    }
  }
}
</script>
