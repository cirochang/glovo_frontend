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
        v-for="(currency, key) in currencies"
        :key="currency.id"
        class="card">
        <div class="card__flipper">
          <div
            :class="getBkgCss(currency)"
            class="card__front">
            <p class="card__name">{{ key }}</p>
            <p 
              :class="getNumCss(currency)"
              class="card__num">{{ currency.price }}</p>
          </div>
          <div class="card__back">
            <svg
              height="180"
              width="180">
              <circle
                cx="90"
                cy="90"
                r="55"
                stroke="#514d9b"
                stroke-width="35"
              />
            </svg>
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
      return Object.keys(this.currencies).map(key => this.currencies[key].price);
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
    try {
      const response = await GLOVO_API.getProducts();
      this.products = response.data;
    } catch (e) {
      console.error(e);
    }
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

<style lang="scss" scoped>
  $color1: #5271C2;
  $color2: #35a541;
  $color3: #bdb235;
  $color4: #db6623;
  $color5: #3e5eb3;
  $color6: #aa9e5c;
  @function longshadow($color_a, $color_b, $stepnum, $opacity: 1) {
    $gradient_steps: null;
    @for $i from 1 through $stepnum {
      $weight: ( ( $i - 1) / $stepnum) * 100;
      $colour_mix: mix($color_b, rgba($color_a, $opacity), $weight);
      $seperator: null;
      @if($i !=$stepnum) {
        $seperator: #{','};
      }
      $gradient_steps: append( #{$gradient_steps}, #{$i}px #{$i}px $colour_mix $seperator);
    }
    @return $gradient_steps;
  }

  @mixin easeOut {
    transition: all .6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  * {
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 15px;
    text-align: center;
    overflow-x: hidden;
  }

  .bkg-green {
    background: $color2;
  }

  .bkg-red {
    background: $color4;
  }

  .bkg-blue {
    background: $color1;
  }

  .card {
    float: left;
    position: relative;
    width: calc(100% * .3333 - 30px + .3333 * 30px);
    height: 340px;
    margin: 0 30px 30px 0;
    perspective: 1000;
    .bkg__blue {
      background: $color1;
    }
    .num__blue {
      text-shadow: longshadow(darken($color1, 15%), $color1, 100, 0.8);
    }
    .bkg__green {
      background: $color2;
    }
    .num__green {
      text-shadow: longshadow(darken($color2, 15%), $color2, 100, 0.8);
    }
    .bkg__red {
      background: $color4;
    }
    .num__red {
      text-shadow: longshadow(darken($color4, 15%), $color4, 100, 0.8);
    }
    &:last-child {
      margin-right: 0;
    }
    &__flipper {
      cursor: pointer;
      transform-style: preserve-3d;
      @include easeOut;
    }
    &__front,
    &__back {
      position: absolute;
      backface-visibility: hidden;
      top: 0;
      left: 0;
      width: 100%;
      height: 200px;
    }
    &__front {
      transform: rotateY(0);
      z-index: 2;
      overflow: hidden;
    }
    &__back {
      transform: rotateY(180deg) scale(1.1);
      background: lighten(black, 8);
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(black, 0.3);
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &__name {
      font-size: 32px;
      line-height: 0.9;
      font-weight: 700;
      span {
        font-size: 14px;
      }
    }
    &__num {
      font-size: 40px;
      margin: 0 8px 0 0;
      font-weight: 700;
      @media (max-width: 700px) {
        font-size: 70px;
      }
    }
    @media (max-width: 700px) {
      width: 100%;
      height: 290px;
      margin-right: 0;
      float: none;
      .card__front,
      .card__back {
        height: 290px;
      }
    }
  }

  main {
    text-align: center;
    h1,
    p {
      margin: 0 0 12px 0;
    }
    h1 {
      margin-top: 12px;
      font-weight: 300;
    }
  }

  .fa-twitter {
    color: white;
    font-size: 30px;
  }

  .custom-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 57px;
    padding: 10px 38px 10px 16px;
    background-size: 10px;
    transition: border-color .1s ease-in-out, box-shadow .1s ease-in-out;
    border: 1px solid #ddd;
    border-radius: 3px;
  }

  .custom-select:hover {
    border: 1px solid #999;
  }

  .custom-select:focus {
    border: 1px solid #999;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, .2);
    outline: none;
  }

  select::-ms-expand {
    display: none;
  }

  a {
    color: #333;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .custom-select {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 1.6rem;
  }
</style>
