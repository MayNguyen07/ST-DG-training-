//Show and hide sidebar
$(".ttl-sidebar").click(function () {
  $(this).next(".category-content").stop().slideToggle(300);
  $(this).find("span").toggleClass("hide show ");
});

//Show product lists
fetch("data/product_list.json")
  .then((response) => response.json())
  .then((productsArray) => {
    renderAllProducts(productsArray);
    onAfterProductsAdded();
    // readyOperate();
  });
function renderAllProducts(productsArray) {
  productsArray.forEach((product) => renderOneProduct(product));
}
const findDiv = document.querySelector(".js-cart-list");
function renderOneProduct(product) {
    const newElement = document.createElement('div')
    newElement.className = 'content-cart'
    newElement.innerHTML = `
            <div class="cart">
                <img src="./${product.img}" class="cart-img">
                <div class="cart-body">
                    <h5 class="cart-title">${product.title}</h5>
                    <p class="cart-text">${product.desc}</p>
                     <p class="cart-price">${product.price}</p>
                    <button data-name="${product.title}" data-price=${product.price} class="cart-button">Add item</button>
                </div>
            </div>
    `
  findDiv.append(newElement)
}

//   var cartListEL = document.createElement("div");
//   cartListEL.classList.add("content-cart");

//   var cartEL = document.createElement("div");
//   cartEL.classList.add("cart");
//   cartListEL.appendChild(cartEL);

//   var cartImgEL = document.createElement("img");
//   cartImgEL.classList.add("cart-img");
//   cartImgEL.src = `./${product.img}`;
//   cartEL.appendChild(cartImgEL);

//   var cartBodyEL = document.createElement("div");
//   cartBodyEL.classList.add("cart-body");
//   cartEL.appendChild(cartBodyEL);

//   var cartTitleEL = document.createElement("h5");
//   cartTitleEL.classList.add("cart-title");
//   cartTitleEL.textContent = `${product.title}`;
//   cartBodyEL.appendChild(cartTitleEL);

//   var cartTextEL = document.createElement("p");
//   cartTextEL.classList.add("cart-text");
//   cartTextEL.textContent = `${product.desc}`;
//   cartBodyEL.appendChild(cartTextEL);

//   var cartPriceEL = document.createElement("p");
//   cartPriceEL.classList.add("cart-price");
//   cartPriceEL.textContent = `${product.price}`;
//   cartBodyEL.appendChild(cartPriceEL);

//   var cartButtonEL = document.createElement("button");
//   cartButtonEL.classList.add("cart-button");
//   cartButtonEL.textContent = "Add item";
//   cartButtonEL.setAttribute("data-name", `${product.title}`);
//   cartButtonEL.setAttribute("data-price", `${product.price}`);
//   cartBodyEL.appendChild(cartButtonEL);
//   findDiv.append(cartListEL);
// }

// ************************************************
// Shopping Cart API
// ************************************************
class ShoppingCartItem {
  constructor(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

}
class ShoppingCart {
  cart = [];
  addItemToCart(name, price, count) {
    for (var item in this.cart) {
      if (this.cart[item].name === name) {
        this.cart[item].count++;
        this.saveCart();
        return;
      }
    }
    console.log('price', price);
    console.log(typeof(price));
    var item = new ShoppingCartItem(name, price, count);
    this.cart.push(item);
    this.saveCart();
  }
  setCountForItem(name, count) {
    for (var i in this.cart) {
      if (this.cart[i].name === name) {
        this.cart[i].count = count;
        break;
      }
    }
  }; 
  removeItemFromCart(name) {
    for (var item in this.cart) {
      if (this.cart[item].name === name) {
        this.cart[item].count--;
        if (this.cart[item].count === 0) {
          this.cart.splice(item, 1);
        }
        break;
      }
    }
    this.saveCart();
  };
  removeItemFromCartAll(name) {
    for (var item in this.cart) {
      if (this.cart[item].name === name) {
        this.cart.splice(item, 1);
        break;
      }
    }
    this.saveCart();
  };
  clearCart() {
    this.cart = [];
    this.saveCart();
  };
  totalCount() {
    var totalCount = 0;
    for (var item in this.cart) {
      totalCount += this.cart[item].count;
    }
    return totalCount;
  };
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
      var itemCopy = {};
      for (var p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };
  saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
  }
  loadCart() {
    this.cart = JSON.parse(localStorage.getItem("shoppingCart")); //shoppingCart se chuyen ve const
  }
}

var shoppingCart = new ShoppingCart();

//code cu
// var shoppingCart = (function () {
//   var cart = [];

//   // Constructor Item
//   function Item(name, price, count) {
//     this.name = name;
//     this.price = price;
//     this.count = count;
//   }
//   // Save cart
//   function saveCart() {
//     localStorage.setItem("shoppingCart", JSON.stringify(cart));
//   }
//   // Load cart
//   function loadCart() {
//     cart = JSON.parse(localStorage.getItem("shoppingCart")); //shoppingCart se chuyen ve const
//   }

//   if (localStorage.getItem("shoppingCart") != null) {
//     loadCart();
//   }

//   // =============================
//   //  methods and propeties
//   // =============================
//   var obj = {};

//   // Add to cart
//   obj.addItemToCart = (name, price, count)=> {
//     for (var item in cart) {
//       if (cart[item].name === name) {
//         cart[item].count++;
//         saveCart();
//         return;
//       }
//     }
//     var item = new Item(name, price, count);
//     cart.push(item);
//     saveCart();
//   };

//   // Set count from item
//   obj.setCountForItem = function (name, count) {
//     for (var i in cart) {
//       if (cart[i].name === name) {
//         cart[i].count = count;
//         break;
//       }
//     }
//   };
//   // Remove item from cart
//   obj.removeItemFromCart = function (name) {
//     for (var item in cart) {
//       if (cart[item].name === name) {
//         cart[item].count--;
//         if (cart[item].count === 0) {
//           cart.splice(item, 1);
//         }
//         break;
//       }
//     }
//     saveCart();
//   };

//   // Remove all items from cart
//   obj.removeItemFromCartAll = function (name) {
//     for (var item in cart) {
//       if (cart[item].name === name) {
//         cart.splice(item, 1);
//         break;
//       }
//     }
//     saveCart();
//   };

//   // Clear cart
//   obj.clearCart = function () {
//     cart = [];
//     saveCart();
//   };

//   // Count cart
//   obj.totalCount = function () {
//     var totalCount = 0;
//     for (var item in cart) {
//       totalCount += cart[item].count;
//     }
//     return totalCount;
//   };

//   // Total cart
//   obj.totalCart = function () {
//     var totalCart = 0;
//     for (var item in cart) {
//       totalCart += cart[item].price * cart[item].count;
//     }
//     return Number(totalCart.toFixed(2));
//   };

//   // List cart
//   obj.listCart = function () {
//     var cartCopy = [];
//     for (i in cart) {
//       item = cart[i];
//       itemCopy = {};
//       for (p in item) {
//         itemCopy[p] = item[p];
//       }
//       itemCopy.total = Number(item.price * item.count).toFixed(2);
//       cartCopy.push(itemCopy);
//     }
//     return cartCopy;
//   };
//   return obj;
// })();

function onAfterProductsAdded() {
  // Add item
  
  $(".cart-button").click(function (event) {
    event.preventDefault();
    var name = $(this).data("name");
    var price = parseInt($(this).data("price"));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
    console.log(name);
    console.log(typeof(price))
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
    console.log(cartArray)
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
  $(".total-cart").html(shoppingCart.totalCart());
  $(".total-count").html(shoppingCart.totalCount());
}

// Delete item button

$(".show-cart").on("click", ".delete-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
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
  shoppingCart.addItemToCart(name, count);
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
