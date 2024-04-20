<template>
  <div class="radio">
    <div class="radio-wrapper">
      <div class="radio-input">
        <i class="v-icon" aria-hidden="true">
          <svg
            v-if="checked"
            class="v-icon__svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"
            ></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            ></path>
          </svg>
        </i>
        <input
          aria-disabled="false"
          type="radio"
          :name="name"
          :value="value"
          :id="id"
          @change="onChange"
        />
      </div>
    </div>
    <label class="radio-label" :for="id">{{ label }}</label>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name: string
  checked: boolean
  label: string
  id: string
  value: string
}>()

const emit = defineEmits(['checked'])
const onChange = (e: InputEvent) => {
  if ((e.target! as HTMLInputElement).checked) {
    emit('checked')
  }
}
</script>

<style>
.radio {
  align-items: center;
  display: inline-flex;
  margin-right: 16px;
  .radio-input {
    width: 32px;
    height: 32px;
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 50%;
  }
  i.v-icon {
    display: block;
    width: 1em;
    height: 1em;
  }
  input[type='radio'] {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    margin: 0;
  }
}
</style>
