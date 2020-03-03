<template>
    <img :src="qr">
</template>
<script>
  // https://github.com/soldair/node-qrcode
  import QRCode from 'qrcode'
  export default {
    props: {
      value: {
        type: [String, Number],
        default: ''
      },
      errorCorrectionLevel: {
        type: String,
        default: 'H'
      },
      margin: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        qr: ''
      }
    },
    mounted () {
      this.generate()
    },
    watch: {
      value () {
        this.generate()
      }
    },
    methods: {
      generate () {
        this.$nextTick(() => {
          QRCode.toDataURL(this.value, {
            errorCorrectionLevel: this.errorCorrectionLevel,
            margin: this.margin
          }).then(url => {
            this.qr = url
          })
        })
      }
    }
  }
</script>
