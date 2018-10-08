<template>
  <div>
    <main>
      <h1>Welcome!</h1>
      <select
        v-model="productSelected"
        class="custom-select">
        <option
          value="">{{ products ? 'Please select a Product:' : 'Loading Products...' }}</option>
        <option
          v-for="product in products"
          :key="product.id">
          {{ product.id }}
        </option>
      </select>
    </main>
    <ul>
      <li
        v-for="currency in currencies"
        :key="currency.exchange"
        class="card">
        <div
          v-if="currency.price"
          class="card__flipper">
          <div
            :class="getBkgCss(currency)"
            class="card__front">
            <p class="card__name">{{ currency.exchange }}</p>
            <p
              :class="getNumCss(currency)"
              class="card__num">{{ currency.price }}</p>
          </div>
        </div>
      </li>
      <span v-if="productSelected && !currencies">Loading prices...</span>
    </ul>
  </div>
</template>

<script>
import GLOVO_API from './gateways/glovoapi';

export default {
  data() {
    return {
      products: null,
      productSelected: '',
      currencies: null,
    };
  },
  computed: {
    allPrices() {
      return this.currencies.reduce((result, currency) => {
        if (currency.price) result.push(currency.price);
        return result;
      }, []);
    },
  },
  watch: {
    async productSelected(product) {
      this.currencies = null;
      const response = await GLOVO_API.getPrices(product);
      this.currencies = response.data;
    },
  },
  async beforeMount() {
    const response = await GLOVO_API.getProducts();
    this.products = response.data;
  },
  methods: {
    isMinPrice(price) {
      return parseFloat(price) === parseFloat(Math.min(...this.allPrices));
    },
    isMaxPrice(price) {
      return parseFloat(price) === parseFloat(Math.max(...this.allPrices));
    },
    getColorByPrice(price) {
      if (this.isMinPrice(price)) return 'red';
      if (this.isMaxPrice(price)) return 'green';
      return 'blue';
    },
    getNumCss(currency) {
      return `num__${this.getColorByPrice(currency.price)}`;
    },
    getBkgCss(currency) {
      return `bkg__${this.getColorByPrice(currency.price)}`;
    },
  },
};
</script>
