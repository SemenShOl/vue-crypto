<script>
const apiKey =
    'ae6d22e2c449642ace74af7e64ade14667fe0cc2fb642c79aa23fb00c4aa6580'
export default {
    name: 'App',

    data() {
        return {
            tickerName: '',
            tickers: [],
            activeTicker: null,
            graph: [],
            coinsList: [],
            isTickerExist: false,
            searchedTickers: [],
        }
    },
    async created() {
        const f = await fetch(
            `https://min-api.cryptocompare.com/data/blockchain/list?apiKey=${apiKey}`
        )
        const data = await f.json()
        this.coinsList = Object.keys(data.Data)
        this.tickers = JSON.parse(
            localStorage.getItem('currentTickers') ?? []
        )
        console.log('this.tickers:', this.tickers)

        this.tickers.forEach((ticker) => {
            setInterval(async () => {
                const f = await fetch(
                    `https://min-api.cryptocompare.com/data/price?fsym=${ticker.name}&tsyms=USD&apiKey=${apiKey}`
                )
                const data = await f.json()
                this.tickers.find(
                    (t) => t.name === ticker.name
                ).price = data.USD

                if (this.activeTicker?.name === ticker?.name) {
                    this.graph.push(data.USD)
                }
            }, 2000)
        })
    },
    methods: {
        add() {
            if (
                this.tickers.find((t) => t.name === this.tickerName)
            ) {
                this.isTickerExist = true
                return
            }
            const currentTicker = {
                name: this.tickerName,
                price: 0,
            }
            this.tickers.push(currentTicker)
            localStorage.setItem(
                'currentTickers',
                JSON.stringify(this.tickers)
            )

            setInterval(async () => {
                const f = await fetch(
                    `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.name}&tsyms=USD&apiKey=${apiKey}`
                )
                const data = await f.json()
                this.tickers.find(
                    (t) => t.name === currentTicker.name
                ).price = data.USD

                if (this.activeTicker?.name === currentTicker?.name) {
                    this.graph.push(data.USD)
                }
            }, 2000)

            this.tickerName = ''
            this.searchedTickers = []
        },
        tickerNameInput() {
            this.isTickerExist = false
            this.searchedTickers = this.coinsList
                .filter((t) =>
                    t
                        .toLowerCase()
                        .includes(this.tickerName.toLowerCase())
                )
                .slice(0, 4)
        },
        deleteItem(name) {
            this.tickers = this.tickers.filter((t) => t.name !== name)
            console.log(this.tickers)
        },

        normalizeGraph() {
            const maxValue = Math.max(...this.graph)
            const minValue = Math.min(...this.graph)

            const result = this.graph.map((value) => {
                return (
                    5 +
                    (95 * (value - minValue)) / (maxValue - minValue)
                )
            })
            return result
        },
    },
}
</script>

<template>
    <div class="p-4">
        <div class="flex flex-col gap-2 w-[140px] mb-3">
            <p>Тикер</p>
            <input
                v-model="tickerName"
                @keydown="tickerNameInput"
                v-on:keydown.enter="add"
                type="text"
                placeholder="Например USD"
            />
            <div class="flex gap-1">
                <p
                    class="text-sm bg-slate-400 text-white p-1 rounded-sm"
                    v-for="t in searchedTickers"
                    @click="add(t)"
                >
                    {{ t }}
                </p>
            </div>
            <p v-if="isTickerExist" class="text-red-600">
                Така валюта уже есть
            </p>
            <button
                v-on:click="add"
                class="text-white bg-slate-500 p-2 rounded-lg"
            >
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
                        'border-4 border-teal-400':
                            activeTicker === t,
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
