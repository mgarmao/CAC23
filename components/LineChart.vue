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
        BarElement,
        CategoryScale,
        LinearScale,
        ArcElement,
        PointElement,
        Legend,
        LineElement,
    } from 'chart.js'
    import { Line } from 'vue-chartjs'

    const props = defineProps(['xData','yData'])

    ChartJS.register(
        CategoryScale,
        Legend,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip
    ) 


    const lineColor = "#BB86FC"
    const gridColor = "#8e8e9f"
    const fillColor = "#A677DF"

    const textColor = "#fff"

    ChartJS.defaults.backgroundColor = fillColor;
    ChartJS.defaults.borderColor = gridColor;
    ChartJS.defaults.color = textColor;



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
            label: "",
            data: props.yData,
            fill: false,
            borderColor: lineColor,
            tension: 0.1,
        }]
    })
    
    const options= ref({
        responsive: true,
        legend: {
            display: false,
        }
    })

</script>
<style scoped>
#background{
    background-color: #282828;
    border-radius: 0.3rem;
}
</style>