import * as $ from "jquery";
//Show and hide sidebar
$(".ttl-sidebar").click(function () {
    $(this).next(".category-content").stop().slideToggle(300);
    $(this).find("span").toggleClass("hide show ");
});
//Show product lists
fetch("data/product_list.json")
    .then(function (response) { return response.json(); })
    .then(function (productsArray) {
    renderAllProducts(productsArray);
    onAfterProductsAdded();
    // readyOperate();
});
function renderAllProducts(productsArray) {
    productsArray.forEach(function (product) { return renderOneProduct(product); });
}
var findDiv = document.querySelector(".js-cart-list");
function renderOneProduct(product) {
    //     const newElement = document.createElement('div')
    //     newElement.className = 'content-cart'
    //     newElement.innerHTML = `
    //             <div class="cart">
    //                 <img src="./${product.img}" class="cart-img">
    //                 <div class="cart-body">
    //                     <h5 class="cart-title">${product.title}</h5>
    //                     <p class="cart-text">${product.desc}</p>
    //                      <pclass="cart-price">${product.price}</p>
    //                     <button data-name=${product.id} class="cart-button">Add item</button>
    //                 </div>
    //             </div>
    //     `
    //   findDiv.append(newElement)
    // }
    var cartListEL = document.createElement("div");
    cartListEL.classList.add("content-cart");
    var cartEL = document.createElement("div");
    cartEL.classList.add("cart");
    cartListEL.appendChild(cartEL);
    var cartImgEL = document.createElement("img");
    cartImgEL.classList.add("cart-img");
    cartImgEL.src = "./" + product.img;
    cartEL.appendChild(cartImgEL);
    var cartBodyEL = document.createElement("div");
    cartBodyEL.classList.add("cart-body");
    cartEL.appendChild(cartBodyEL);
    var cartTitleEL = document.createElement("h5");
    cartTitleEL.classList.add("cart-title");
    cartTitleEL.textContent = "" + product.title;
    cartBodyEL.appendChild(cartTitleEL);
    var cartTextEL = document.createElement("p");
    cartTextEL.classList.add("cart-text");
    cartTextEL.textContent = "" + product.desc;
    cartBodyEL.appendChild(cartTextEL);
    var cartPriceEL = document.createElement("p");
    cartPriceEL.classList.add("cart-price");
    cartPriceEL.textContent = "" + product.price;
    cartBodyEL.appendChild(cartPriceEL);
    var cartButtonEL = document.createElement("button");
    cartButtonEL.classList.add("cart-button");
    cartButtonEL.textContent = "Add item";
    cartButtonEL.setAttribute("data-name", "" + product.title);
    cartButtonEL.setAttribute("data-price", "" + product.price);
    cartBodyEL.appendChild(cartButtonEL);
    findDiv.append(cartListEL);
}
// ************************************************
// Shopping Cart API
// ************************************************
var ShoppingCartItem = /** @class */ (function () {
    function ShoppingCartItem(name, price, count) {
        this.name = name;
        this.price = price;
        this.count = count;
    }
    return ShoppingCartItem;
}());
var ShoppingCart = /** @class */ (function () {
    function ShoppingCart() {
        this.cart = [];
    }
    ShoppingCart.prototype.addItemToCart = function (name, price, count) {
        for (var _i = 0, _a = this.cart; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === name) {
                item.count++;
                this.saveCart();
                return;
            }
        }
        var newItem = new ShoppingCartItem(name, price, count);
        this.cart.push(newItem);
        this.saveCart();
    };
    ShoppingCart.prototype.setCountForItem = function (name, count) {
        for (var _i = 0, _a = this.cart; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === name) {
                item.count = count;
                break;
            }
        }
    };
    ;
    ShoppingCart.prototype.removeItemFromCart = function (name) {
        var _this = this;
        this.cart.slice().forEach(function (item) {
            if (item.name === name) {
                item.count--;
                if (item.count === 0) {
                    var index = _this.cart.indexOf(item);
                    if (index >= 0) {
                        _this.cart.splice(index, 1);
                    }
                }
            }
        });
        this.saveCart();
    };
    ;
    ShoppingCart.prototype.removeItemFromCartAll = function (name) {
        for (var item in this.cart) {
            if (this.cart[item].name === name) {
                this.cart.splice(item, 1);
                break;
            }
        }
        this.saveCart();
    };
    ;
    ShoppingCart.prototype.clearCart = function () {
        this.cart = [];
        this.saveCart();
    };
    ;
    ShoppingCart.prototype.totalCount = function () {
        var totalCount = 0;
        for (var item in this.cart) {
            totalCount += this.cart[item].count;
        }
        return totalCount;
    };
    ;
    ShoppingCart.prototype.totalCart = function () {
        var totalCart = 0;
        for (var item in this.cart) {
            totalCart += this.cart[item].price * this.cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    };
    ShoppingCart.prototype.listCart = function () {
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
    ;
    ShoppingCart.prototype.saveCart = function () {
        localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
    };
    ShoppingCart.prototype.loadCart = function () {
        this.cart = JSON.parse(localStorage.getItem("shoppingCart")); //shoppingCart se chuyen ve const
    };
    return ShoppingCart;
}());
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
