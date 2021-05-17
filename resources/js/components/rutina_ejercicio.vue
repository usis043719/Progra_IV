<template>
    <form v-on:submit.prevent="guardarCalcular_peso" v-on:reset="limpiar">
    <div class="row">
        <div class="col-sm-5">
            <div class="row p-2">
                <div class="col-sm text-center text-white btn-success">
                    <h5>CALCULAR PESO/h5>
                </div>
            </div>


  <vue-core-video-player src="./videos/your_video.mp4"></vue-core-video-player>            
</template>


<script>
import VueCoreVideoPlayer from 'vue-core-video-player';

export default {
  name: 'app',
  components: {
    VueCoreVideoPlayer
  }
}
</script>
