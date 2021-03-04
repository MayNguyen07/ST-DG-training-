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
    //   onAfterProductsAdded();
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
                      <button data-name=${product.id} class="cart-button">Add item</button>
                  </div>
              </div>
      `
    findDiv.append(newElement)
  }

// item 
class Item {
	constructor(name, price, quantity) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
	}
}

//   cart
class Cart {
	constructor() {
		this.items = [];
		this.total = 0;
	}

	addItem(newItem) {
		let sameItem = this.items.filter(item => item.name == newItem.name);
		if (sameItem.length > 0) {
			const updatedItem = {
				...sameItem[0],
				quantity: sameItem[0].quantity + 1
			};
			this.items = [
				...this.items.filter(item => item.name !== newItem.name),
				updatedItem
			];
		} else {
			this.items = [...this.items, newItem];
		}
	}

	getTotal() {
		return this.items
			.map(item => item.price * item.quantity)
			.reduce(
				(accumulator, currentValue) => accumulator + currentValue,
				0
			);
	}

	removeItem(itemNameToRemove) {
		this.items = [
			...this.items.filter(item => {
				return item.name != itemNameToRemove;
			})
		];
	}

	updateQuantity(itemName, newQuantity) {
		this.items = this.items.map(item => {
			if (item.name == itemName)
				return { ...item, quantity: newQuantity };
			else return { ...item };
		});
	}
}

// shopping cart
let myCart = new Cart();
let itemsTable, cartEl;

const itemRowClick = (event) => {
	let dataset = event.target.parentNode.dataset;
	myCart.addItem(
		new Item(dataset['name'], parseInt(dataset['price']).toFixed(2))
	);
	let cartTotalEl = document.getElementById('cart-total');
	cartTotalEl.innerText = myCart.getTotal().toFixed(2);
	displayCartItems();
}

const generateTable = () => {
	document.body.insertAdjacentHTML(
		'afterbegin',
		`<table>
			<thead>
				<tr>
					<td>Name</td>
					<td>Price</td>
				</tr>
			</thead>
			<tbody></tbody>
		</table>`
	);

	itemsTable = document.getElementsByTagName('table')[0];
	itemsTable.setAttribute('id', 'items-table');
	itemsTable.insertAdjacentHTML('beforebegin', '<h2>Items list</h2>');
	itemsTable.insertAdjacentHTML('afterend', '<h2>Cart</h2>');
	itemsTable.querySelector('tbody').addEventListener('click', itemRowClick);
};

const displayItems = () => {
	let tableBody = itemsTable.querySelector('tbody');
	items.forEach(item => {
		tableBody.insertAdjacentHTML(
			'beforeend',
			`<tr data-name=${item.name} data-price='${item.price}'><td>${
				item.name
			}</td><td>${parseInt(item.price).toFixed(2)}</td></tr>`
		);
	});
};

const removeItemFromCart = () => {
	let itemName = event.target.closest('.cart-row').dataset['name'];
	myCart.removeItem(itemName);
	displayCartItems();
	let cartTotalEl = document.getElementById('cart-total');
	cartTotalEl.innerText = myCart.getTotal().toFixed(2);
};

const updateItemQuantity = () => {
	let itemName = event.target.closest('.cart-row').dataset['name'];
	let itemQuantity = parseInt(
		event.target.previousSibling.previousSibling.value
	);
	if (itemQuantity == 0) {
		myCart.removeItem(itemName);
		displayCartItems();
	} else {
		myCart.updateQuantity(itemName, itemQuantity);
	}
	let cartTotalEl = document.getElementById('cart-total');
	cartTotalEl.innerText = myCart.getTotal().toFixed(2);
};

const onCartRowClick = event => {
	if (event.target.dataset.action == 'remove') {
		removeItemFromCart();
	} else if (event.target.dataset.action == 'update') {
		updateItemQuantity();
	}
};

const generateCart = () => {
	let cartTitle = document.getElementsByTagName('h2')[1];
	cartTitle.insertAdjacentHTML('afterend', '<div id="cart"></div>');
	cartEl = document.getElementById('cart');
	cartEl.insertAdjacentHTML(
		'afterbegin',
		`
		<div id="cart-header">
			<div>Name</div>
			<div>Price</div>
			<div>Quantity</div>
			<div>Options</div>
	</div>`
	);
	cartEl.insertAdjacentHTML(
		'beforeend',
		`
	<div>
		<div id="cart-rows"></div>
		<div id="total-row">Total: $<span id="cart-total">${myCart
			.getTotal()
			.toFixed(2)}</span></div>
	</div>`
	);
	cartEl
		.querySelector('#cart-rows')
		.addEventListener('click', onCartRowClick);
};

const displayCartItems = () => {
	let items = myCart.getItems();
	let cartRowsContainer = cartEl.querySelector('#cart-rows');
	cartRowsContainer.textContent = '';
	items.forEach(item => {
		cartRowsContainer.insertAdjacentHTML(
			'beforeend',
			`
			<div class="cart-row" data-name="${item.name}">
				<div class="item-name-col">${item.name}</div>
				<div>$${parseInt(item.price).toFixed(2)}</div>
				<div>
					<input type="number" min="0" max="100" value="${item.quantity}">
					<button data-action="update">update</button>
				</div>
				<button data-action="remove">Remove Item</button>
			</div>
		`
		);
	});
};

generateTable();
displayItems();
generateCart();
displayCartItems();