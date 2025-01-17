<script>
const apiKey =
  "ae6d22e2c449642ace74af7e64ade14667fe0cc2fb642c79aa23fb00c4aa6580";
export default {
  name: "App",
  data() {
    return {
      tickerName: "",
      tickers: [],
      activeTicker: null,
      graph: [],
    };
  },
  methods: {
    add() {
      const currentTicker = {
        name: this.tickerName,
        price: 0,
      };
      this.tickers.push(currentTicker);

      setInterval(async () => {
        const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.name}&tsyms=USD&apiKey=${apiKey}`,
        );
        const data = await f.json();
        this.tickers.find((t) => t.name === currentTicker.name).price =
          data.USD;

        if (this.activeTicker.name === currentTicker.name) {
          this.graph.push(data.USD);
        }
      }, 2000);

      this.tickerName = "";
    },
    deleteItem(name) {
      this.tickers = this.tickers.filter((t) => t.name !== name);
      console.log(this.tickers);
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      console.log("minValue:", minValue);
      console.log("maxValue:", maxValue);

      console.log("graph:", this.graph);
      const result = this.graph.map((value) => {
        return 5 + (95 * (value - minValue)) / (maxValue - minValue);
      });
      console.log(result);
      return result;
    },
  },
};
</script>

<template>
  <div class="p-4">
    <div class="flex flex-col gap-2 w-[140px] mb-3">
      <p>Тикер</p>
      <input
        v-model="tickerName"
        v-on:keydown.enter="add"
        type="text"
        placeholder="Например USD"
      />
      <button v-on:click="add" class="text-white bg-slate-500 p-2 rounded-lg">
        Добавить +
      </button>
    </div>

    <div v-if="tickers.length" class="mb-3">
      <hr class="mb-2" />
      <ul class="flex gap-2">
        <li
          v-bind:key="t.name"
          v-for="(t, index) in tickers"
          @click="activeTicker = t"
          class="flex flex-col border-2 rounded-lg p-2 w-[200px]"
          :class="{
            'border-4 border-teal-400': activeTicker === t,
          }"
        >
          <h2>
            {{ t.name }}
          </h2>
          <p>
            {{ t.price }}
          </p>
          <button
            v-on:click.stop="deleteItem(t.name)"
            class="text-white bg-slate-500 p-2 rounded-lg"
          >
            Удалить
          </button>
        </li>
      </ul>
    </div>

    <div class="flex gap-1 h-[200px] rotate-180 mr-auto">
      <div
        class="bg-teal-500 w-[10px]"
        :style="{
          height: bar + '%',
        }"
        v-for="bar in normalizeGraph()"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
