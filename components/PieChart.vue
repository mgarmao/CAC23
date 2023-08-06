<template>
    <div id="background" :style="widthRef">
        <Pie :data="data" :options="options"/>
    </div>
  </template>
  
  <script setup>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
  } from 'chart.js'
  import { Pie } from 'vue-chartjs'
  
  const props = defineProps(['labels','values','width'])

  const widthRef = ref("width:"+props.width+"px;")

  ChartJS.register(ArcElement, Tooltip, Legend)
  ChartJS.defaults.color = '#fff';

  const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#99ffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
    };

    const data = ref({
        labels: props.labels,
        datasets: [{
            data: props.values,
            backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    })
    
    const options= ref({
        responsive: true
    })

</script>
<style scoped>
#background{
    /* background-color: #fff; */
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>