var eventBus= new Vue()

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    }
  },
  template: `
    	<div class="product">
			<div class="product-image">
				<img v-bind:src="image">
			</div>
			<div class="product-info">
				<h1 v-if="onSale">{{ title }}</h1>
				<h1 class="striker" v-else="onSale">{{ title }}</h1>
				<p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>
				<p>Details</p>
				<ul>
					<li v-for="i in details">{{ i }}</li>
				</ul>
				<p>Sizes</p>
					<ul>
						<li v-for="i in sizes">{{ i }}</li>
                    </ul>
            <div v-for="(i, index) in variant" 
					 :key="i.variantId"
					 class="color-box"
					 :style="{backgroundColor: i.variantColor}"
					 @mouseover="updateProduct(index)">
            </div>
            <div class="buttons">
				<button v-on:click="addToCart"
						:disabled="!inStock"
						:class="{disabledButton: !inStock}">Add To Cart</button>
                <button v-on:click="removeFromCart">Remove From Cart</button>
            </div>
            </div>
            
                <product-tabs :reviews="reviews"></product-tabs>

                       
        
           

        </div>
    `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedVariant: 0,
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      sizes: ["20 cm", "15 cm", "30 cm"],
      link: "https://www.google.com",
      variant: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./image/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./image/socks_blue.jpg",
          variantQuantity: 0,
        },
      ],
      reviews: []
    }
  },
  methods: {
    addToCart: function () {
      this.$emit("add-to-cart", this.variant[this.selectedVariant].variantId);
    },
    removeFromCart: function () {
      this.$emit(
        "remove-from-cart",
        this.variant[this.selectedVariant].variantId
      )
    },
    updateProduct: function (index) {
      this.selectedVariant = index;
    }

  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variant[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variant[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else return 2.99;
    }
  },
  mounted() {
      eventBus.$on("review-submitted",productReview =>{
           this.reviews.push(productReview)
      })
  }
})

Vue.component("product-review",{
    template:`

    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
    <b>Please correct the following error(s):</b></p>
    <ul>
        <li v-for="i in errors">{{ i }}</li>
    </ul>

    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
    </p>

     <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>

     <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>

    <p>
    <input type="submit" value="Submit">
    </p>

    </form>
    `,
    data() {
        return{
            name:null,
            review:null,
            rating:null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating){
              let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
              };
              eventBus.$emit("review-submitted", productReview);
              this.name = null;
              this.review = null;
              this.rating = null;
              this.errors =[];
            }else{
                if(!this.name) this.errors.push("Name is required")
                if (!this.rating) this.errors.push("Rating is required")
                if (!this.review) this.errors.push("Review is required")
            }
        }
    }
})

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
        <div>
            <span class="tab" 
             :class ="{activeTab: selectedTab === i}"
             v-for ="(i, index) in tabs" 
             :key ="index"
             @click ="selectedTab = i">
             {{ i }}</span>

             <div v-show ="selectedTab ==='Reviews'">
                <p v-if = "!reviews.length">There are no reviews yet.</p>
                <ul>
                <li v-for ="i in reviews">
                    <p>{{ i.name }}</p>
                    <p>Rating: {{ i.rating }}</p>
                    <p>{{ i.review }}</p>
                </li>
                </ul>
            </div>
             <product-review  v-show ="selectedTab ==='Make a Review'" ></product-review>
        </div>

    `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    }
  }
})


var app =new Vue({
    el : "#app",
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        reupdateCart(id) {
            if (this.cart > [0]) {
                this.cart.pop(id)
            }
        }
    }
}) 