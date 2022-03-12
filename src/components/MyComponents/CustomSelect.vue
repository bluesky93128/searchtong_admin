<template>
  <div class="my-custom-select status-option-container" :tabindex="tabindex" @blur="open = false">
    <div class="selected" :class="{ open: open }" @click="open = !open">
      <div class="d-flex align-items-center">
        <div :class="'status mr-2 ' + getStatus(selected.value)"></div>
        <span>{{selected.text}}</span>
      </div>
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option;
          open = false;
          $emit('input', option);
        "
      >
        <div class="d-flex align-items-center">
          <div :class="'status mr-2 ' + getStatus(option.value)"></div>
          <span>{{option.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: Object,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0]
        : null,
      open: false,
    };
  },
  mounted() {
    // this.$emit("input", this.selected);
  },
  methods: {
    getStatus(option) {
      switch(option) {
        case 0: return 'working';
        case 1: return 'reserved';
        case 2: return 'onhold';
        case 3: return 'stopped';
        case 4: return 'finished';
      }
    }
  }
};
</script>

<style scoped>
.my-custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 32px;
  line-height: 32px;
}

.my-custom-select .selected {
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #666666;
  color: #0a0a0a;
  padding-left: 10px;
  cursor: pointer;
  user-select: none;
}

.my-custom-select .selected.open {
  border: 1px solid #ad8225;
  border-radius: 6px 6px 0px 0px;
}

.my-custom-select .selected:after {
  position: absolute;
  content: "";
  top: 14px;
  right: 1em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: #0a0a0a transparent transparent transparent;
}

.my-custom-select .items {
  color: #0a0a0a;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  border-right: 1px solid #ad8225;
  border-left: 1px solid #ad8225;
  border-bottom: 1px solid #ad8225;
  position: absolute;
  background-color: #fff;
  left: 0;
  right: 0;
  z-index: 1;
}

.my-custom-select .items div {
  color: #0a0a0a;
  padding-left: 5px;
  cursor: pointer;
  user-select: none;
}

.my-custom-select .items div:hover {
  background-color: #ad8225;
}

.selectHide {
  display: none;
}
</style>
