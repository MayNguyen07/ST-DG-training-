fetch('data/product_list.json')
.then(response => response.json())
.then(productsArray => renderAllProducts(productsArray));
function renderAllProducts(productsArray) {
    productsArray.forEach(product => renderOneProduct(product));
}
const findDiv = document.querySelector('#cart_list')
function renderOneProduct(product) {
    var URL = './img/common'
    console.log('create product');
    const newElement = document.createElement('div')
    newElement.className = 'content_cart'
    newElement.innerHTML = `
            <div class="cart">
                <img src="./${product.img}" class="cart-img">
                <div class="cart-body">
                    <h5 class="cart-title">${product.title}</h5>
                    <p class="cart-text">${product.desc}</p>
                    <button data-name=${product.id} class="cart-button">Add item</button>
                </div>
            </div>
    `
    findDiv.append(newElement)
}

// Shopping Cart 
var shoppingCart = (function() {
    cart = [];
    // Constructor
    function Item(name, count) {
      this.name = name;
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
      var item = new Item(name, count);
      cart.push(item);
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
    return obj;
  })();

  // Add item
$('.add-to-cart').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    shoppingCart.addItemToCart(name, 1);
    displayCart();
  });
  

  