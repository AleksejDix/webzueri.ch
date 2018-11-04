<template>
  <Card>
    <h2 slot="title">Call for paper</h2>
    <FormTalkNew />
  </Card>
</template>

<script>
import Card from '@/components/Card'
import FormTalkNew from '@/components/forms/talk/new/'
export default {
  components: {FormTalkNew, Card}
}
</script>

