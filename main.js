Vue.component("product",{
    props:{
        premium: {
            type: Boolean,
            required: true
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
            <div>
                <h2>Reviews</h2>
                <p>There are no reviews yet.</p>
                <ul>
                <li v-for="i in reviews">
                    <p>{{ i.name }}</p>
                    <p>Rating: {{ i.rating }}</p>
                    <p>{{ i.review }}</p>
                </li>
            </div>
            <product-review @review-submitted="addReview"></product-review>
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
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./image/socks_blue.jpg",
                    variantQuantity: 0
                }
            ],
            reviews:[]

        }
    },
    methods: {
        addToCart: function () {
            this.$emit("add-to-cart", this.variant[this.selectedVariant].variantId)
        },
        removeFromCart: function () {
            this.$emit("remove-from-cart", this.variant[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        addReview (productReview){
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + " " + this.product
        },
        image() {
            return this.variant[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variant[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }else
            return 2.99
        }

    }

})

Vue.component("product-review",{
    template:`

    <form class="review-form" @submit.prevent="onSubmit">

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
            rating:null
        }
    },
    methods:{
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
                this.$emit("review-submitted",productReview)
                this.name= null
                this.review= null 
                this.rating= null
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