 //Show and hide sidebar
$(".ttl-sidebar").click (function(){
  $(this).next(".category-content").stop().slideToggle(300);
  $(this).find('span').toggleClass('hide show ');
});


 //Show product lists 
fetch('data/product_list.json')
.then(response => response.json())
.then(productsArray => {
  renderAllProducts(productsArray);
  onAfterProductsAdded();
  // readyOperate();
});
function renderAllProducts(productsArray) {
    productsArray.forEach(product => renderOneProduct(product));
}
const findDiv = document.querySelector('.js-cart-list')
function renderOneProduct(product) {
  //   const newElement = document.createElement('div')
  //   newElement.className = 'content-cart'
  //   newElement.innerHTML = `
  //           <div class="cart">
  //               <img src="./${product.img}" class="cart-img">
  //               <div class="cart-body">
  //                   <h5 class="cart-title">${product.title}</h5>
  //                   <p class="cart-text">${product.desc}</p>
  //                    <pclass="cart-price">${product.price}</p>
  //                   <button data-name=${product.id} class="cart-button">Add item</button>
  //               </div>
  //           </div>
  //   `
  // findDiv.append(newElement)

  var cartListEL = document.createElement("div");
  cartListEL.classList.add("content-cart");

  var cartEL = document.createElement("div");
  cartEL.classList.add("cart");
  cartListEL.appendChild(cartEL);

  var cartImgEL = document.createElement("img");
  cartImgEL.classList.add("cart-img");
  cartImgEL.src = `./${product.img}`;
  cartEL.appendChild(cartImgEL);

  var cartBodyEL = document.createElement("div");
  cartBodyEL.classList.add("cart-body");
  cartEL.appendChild(cartBodyEL);

  var cartTitleEL = document.createElement("h5");
  cartTitleEL.classList.add("cart-title");
  cartTitleEL.textContent=`${product.title}`;
  cartBodyEL.appendChild(cartTitleEL);

  var cartTextEL = document.createElement("p");
  cartTextEL.classList.add("cart-text");
  cartTextEL.textContent=`${product.desc}`;
  cartBodyEL.appendChild(cartTextEL);

  var cartPriceEL = document.createElement("p");
  cartPriceEL.classList.add("cart-price");
  cartPriceEL.textContent=`${product.price}`;
  cartBodyEL.appendChild(cartPriceEL);

  var cartButtonEL = document.createElement("button");
  cartButtonEL.classList.add("cart-button");
  cartButtonEL.textContent="Add item";
  cartBodyEL.appendChild(cartButtonEL);
  // cartButtonEL.addEventListener('click', addToCartClicked);

  findDiv.append(cartListEL);
}

// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  
  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  
  // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }

  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(name, price, count) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  }
  console.log(Item)
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();

function onAfterProductsAdded() {
  // Add item
  $('.cart-button').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
  });
}


// *****************************************
// Triggers / Events
// ***************************************** 


// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td>(" + cartArray[i].price + ")</td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();


// function readyOperate() {

//   var addToCartButtons = document.getElementsByClassName('cart-button')
//   for (var i = 0; i < addToCartButtons.length; i++) {
//     var button = addToCartButtons[i]
//     button.addEventListener('click', addToCartClicked)
//   }

//   var removeCartItemButtons = document.getElementsByClassName('btn-danger')
//     for (var i = 0; i < removeCartItemButtons.length; i++) {
//         var button = removeCartItemButtons[i]
//         button.addEventListener('click', removeCartItem)
//     }

// }


// // Add to cart 
// function addToCartClicked(event) {
//   var button = event.target
//   var shopItem = button.parentElement.parentElement
//   var title = shopItem.getElementsByClassName('cart-title')[0].innerText
//   var price = shopItem.getElementsByClassName('cart-price')[0].innerText
//   var imageSrc = shopItem.getElementsByClassName('cart-img')[0].src
//   addItemToCart(title, price, imageSrc)
// }

// function addItemToCart(title, price, imageSrc) {
//   var cartRow = document.createElement('div')
//   cartRow.classList.add('cart-row')
//   var cartItems = document.getElementsByClassName('cart-items')[0]
//   var cartRowContents = `
//       <div class="cart-item cart-column">
//           <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
//           <span class="cart-item-title">${title}</span>
//       </div>
//       <span class="cart-price cart-column">${price}</span>
//       <div class="cart-quantity cart-column">
//           <input class="cart-quantity-input" type="number" value="1">
//           <button class="btn btn-danger" type="button">REMOVE</button>
//       </div>`
//   cartRow.innerHTML = cartRowContents
//   cartItems.append(cartRow);
//   $('.btn-danger', cartItems).click(

//   )
//   cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
// }

// // Remove cart button

// function removeCartItem(event){
//   var removeClicked = event.target
//   removeClicked.parentElement.parentElement.remove()
//   updateCartTotal() 
// }


// function updateCartTotal() {
//   var cartItemContainer = document.getElementsByClassName('cart-items')[0]
//   var cartRows = cartItemContainer.getElementsByClassName('cart-row')
//   var total = 0 
//   for (var i = 0; i < cartRows.length; i++) {
//       var cartRow = cartRows[i]
//       var priceElement = cartRow.getElementsByClassName('cart-price')[0]
//       var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
//       var price = parseFloat(priceElement.innerText.replace('$', ''))
//       var quantity = quantityElement.value
//       total = total + (price * quantity)
//   }
//   total = Math.round(total * 100) / 100
//   document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
// }

