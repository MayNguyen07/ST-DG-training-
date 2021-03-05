import $ from "jquery";

//Show and hide sidebar
$(".ttl-sidebar").click(function () {
  $(this).next(".category-content").stop().slideToggle(300);
  $(this).find("span").toggleClass("hide show ");
});

interface product {
  id: number;
  title: string;
  desc: string;
  img: string;
  price: number;
}

//Show product lists
fetch("data/product_list.json")
  .then((response) => response.json())
  .then((productsArray) => {
    renderAllProducts(productsArray);
    onAfterProductsAdded();
  });
function renderAllProducts(productsArray: product[]) {
  productsArray.forEach((product: product) => renderOneProduct(product));
}
const findDiv = document.querySelector(".js-cart-list");
function renderOneProduct(product: product) {
  const newElement = document.createElement("div");
  newElement.className = "content-cart";
  newElement.innerHTML = `
              <div class="cart">
                  <img src="./${product.img}" class="cart-img">
                  <div class="cart-body">
                      <h5 class="cart-title">${product.title}</h5>
                      <p class="cart-text">${product.desc}</p>
                       <pclass="cart-price">${product.price}</p>
                      <button data-name="${product.title}" data-price=${product.price} class="cart-button">Add item</button>
                  </div>
              </div>
      `;
  findDiv?.append(newElement);
}

// ************************************************
// Shopping Cart API
// ************************************************
class ShoppingCartItem {
  constructor(
    readonly name: string,
    readonly price: number,
    public count: number
  ) { }

  get total(): string {
    return Number(this.price * this.count).toFixed(2);
  }
}

class ShoppingCart {
  private cart: ShoppingCartItem[] = [];

  addItemToCart(name: string, price: number, count: number) {
    for (const item of this.cart) {
      if (item.name === name) {
        item.count++;
        this.saveCart();
        return;
      }
    }

    const newItem = new ShoppingCartItem(name, price, count);
    this.cart.push(newItem);
    this.saveCart();
  }

  setCountForItem(name: string, count: number) {
    for (const item of this.cart) {
      if (item.name === name) {
        item.count = count;
        break;
      }
    }
  }
  removeItemFromCart(name: string) {
    this.cart.slice().forEach((item) => {
      if (item.name === name) {
        item.count--;
        if (item.count === 0) {
          const index = this.cart.indexOf(item);
          if (index >= 0) {
            this.cart.splice(index, 1);
          }
        }
      }
    });

    this.saveCart();
  }
  removeItemFromCartAll(name: string) {
    this.cart.slice().forEach((item) => {
      const index = this.cart.indexOf(item);
      if (item.name === name) {
        this.cart.splice(index, 1);
      }

    });
    this.saveCart();
  }
  clearCart() {
    this.cart = [];
    this.saveCart();
  }
  totalCount() {
    var totalCount = 0;
    for (var item in this.cart) {
      totalCount += this.cart[item].count;
    }
    return totalCount;
  }
  totalCart() {
    var totalCart = 0;
    for (var item in this.cart) {
      totalCart += this.cart[item].price * this.cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }
  listCart() {
    var cartCopy = [];
    for (var i in this.cart) {
      var item = this.cart[i];
      const itemCopy = new ShoppingCartItem(item.name, item.price, item.count);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  }
  saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
  }
  loadCart() {
    const itemJson = localStorage.getItem("shoppingCart");
    if (itemJson) {
      this.cart = JSON.parse(itemJson);
    }
  }
}

var shoppingCart = new ShoppingCart();

function onAfterProductsAdded() {
  // Add item
  $(".cart-button").click(function (event) {
    event.preventDefault();
    var name = $(this).data("name");
    var price = Number($(this).data("price"));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
  });
}

// Clear items
$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i in cartArray) {
    output +=
      "<tr>" +
      "<td>" +
      cartArray[i].name +
      "</td>" +
      "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" +
      cartArray[i].name +
      ">-</button>" +
      "<input type='number' class='item-count form-control' data-name='" +
      cartArray[i].name +
      "' value='" +
      cartArray[i].count +
      "'>" +
      "<button class='plus-item btn input-group-addon' data-name=" +
      cartArray[i].name +
      ">+</button></div></td>" +
      "<td><button class='delete-item' data-name=" +
      cartArray[i].name +
      ">X</button></td>" +
      " = " +
      "<td>" +
      cartArray[i].total +
      "</td>" +
      "</tr>";
  }
  $(".show-cart").html(output);
  $(".total-cart").html(shoppingCart.totalCart().toString());
  $(".total-count").html(shoppingCart.totalCount().toString());
}

// Delete item button

$(".show-cart").on("click", ".delete-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
  console.log("shopping", shoppingCart)
});

// -1
$(".show-cart").on("click", ".minus-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});
// +1
$(".show-cart").on("click", ".plus-item", function (event) {
  var name = $(this).data("name");
  var count = $(this).data("count");
  var price = $(this).data("price");
  shoppingCart.addItemToCart(name, price, count);
  displayCart();
});

// Item count input
$(".show-cart").on("change", ".item-count", function (event) {
  var name = $(this).data("name");
  var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
