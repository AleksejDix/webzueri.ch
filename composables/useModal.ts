import { ref } from 'vue';

export function useModal() {
  const isOpen = ref(false);
  const component = ref(null);
  const props = ref({});

  function openModal(modalComponent: any, modalProps = {}) {
    isOpen.value = true;
    component.value = modalComponent;
    props.value = modalProps;
  }

  function closeModal() {
    isOpen.value = false;
    component.value = null;
    props.value = {};
  }

  return {
    isOpen,
    component,
    props,
    openModal,
    closeModal
  };
} 