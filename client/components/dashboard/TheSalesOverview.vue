<script setup lang="ts">
import { ref, onMounted,computed } from "vue";
const token = useCookie('token');

/*Chart*/
const chartOptions = computed(() => {
    return {
      grid: {
      show: false,
      borderColor: "transparent",
      padding: { left: 0, right: 0, bottom: 0 },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "35%", borderRadius: 0 },
    },
    colors: ['#1e88e5','#0cb9c5'],
    fill: { type: "solid", opacity: 1 },
    chart: {
      type: "bar",
      height: 320,
      offsetX: -15,
      toolbar: { show: false },
      foreColor: "#adb0bb",
      fontFamily: "Poppins",
      sparkline: { enabled: false },
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    legend: { show: false },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 10,
      tickAmount: 3,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: { theme: "light" },
    };
});

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(userTimezone);
const response = await fetch('http://localhost:4000/chart/', {
  method: "POST",
  headers: {
    "Authorization": token ? "Bearer " + token.value : "",
  },
  body: JSON.stringify({"timezone": userTimezone}),
});
const Chart = await response.json();
console.log(Chart);

//     {
//   series: [
//     { name: "Completed", data: [355, 390, 300, 350, 390, 180, 250] },
//     { name: "Uncompleted", data: [280, 250, 325, 215, 250, 310, 170] },
//   ],
// };

const elementVisible = ref(false);
onMounted(() => {
  setTimeout(() => (elementVisible.value = true), 10);
});
</script>

<template>
  <!-- ------------------------------------ -->
  <!-- html -->
  <!-- ------------------------------------ -->
<VCard elevation="10">
    <v-card-text>
      <div class="d-sm-flex align-center">
        <div>
          <h3 class="text-h5 title mb-1">Tasks Overview</h3>
          <h5 class="text-subtitle-1">Completed tasks vs Uncompleted tasks</h5>
        </div>
        <div class="ml-auto">
          <div class="d-flex align-center">
            <div class="d-flex align-center px-2">
              <span class="text-primary">
                <span class="text-overline">
                  <i class="mdi mdi-brightness-1 mx-1"></i>
                </span>
                <span class="font-weight-regular">Completed</span>
              </span>
            </div>
            <div class="d-flex align-center px-2">
              <span class="text-secondary">
                <span class="text-overline">
                  <i class="mdi mdi-brightness-1 mx-1"></i>
                </span>
                <span class="font-weight-regular">Uncompleted</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="elementVisible" class="mt-5">
        <apexchart
        type="bar" height="400" :options="chartOptions" :series="Chart.series"
        ></apexchart>
      </div>
    </v-card-text>
  </VCard>
</template>
