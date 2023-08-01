<template>
    <div id="background">
        <Line :data="data" :options="options"/>
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
        ArcElement,
        PointElement,
        LineElement,
    } from 'chart.js'
    import { Line } from 'vue-chartjs'

    const props = defineProps(['xData','yData'])

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    ) 

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
        labels: props.xData,
        datasets: [{
            data: props.yData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        }]
    })
    
    const options= ref({
        responsive: true
    })

</script>
<style scoped>
#background{
    background-color: #fff;
    border-radius: 0.3rem;
}
</style>