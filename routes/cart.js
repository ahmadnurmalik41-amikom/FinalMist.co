// ====================
// CART SIDEBAR
// ====================

let cart = [];

function toggleCart(){
    document.getElementById('cartSidebar')
        .classList.toggle('active');

    document.getElementById('cartOverlay')
        .classList.toggle('active');
}

// ADD TO CART
function addToCart(name, price, image){

    cart.push({
        name,
        price,
        image
    });

    updateCart();
}

// UPDATE CART
function updateCart(){

    const cartItems =
        document.getElementById('cart-items');

    const cartCount =
        document.getElementById('cart-count');

    const cartTotal =
        document.getElementById('cart-total');

    cartItems.innerHTML = '';

    let total = 0;

    cart.forEach(item => {

        total += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}">

                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>

            </div>
        `;
    });

    cartCount.innerText = cart.length;
    cartTotal.innerText = total;

    if(cart.length === 0){
        cartItems.innerHTML =
        `<p class="empty-cart">
            Cart is empty
        </p>`;
    }
}

// CART PAGE
app.get('/cart', (req, res) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

    res.render('cart', {
        cart: req.session.cart,
        user: req.session.user
    });

});
// ADD TO CART
app.get('/cart/add/:id', (req, res) => {

    const productId = req.params.id;

    db.query(
        'SELECT * FROM products WHERE id = ?',
        [productId],
        (err, result) => {

            if (err) throw err;

            if (!req.session.cart) {
                req.session.cart = [];
            }

            req.session.cart.push(result[0]);

            res.redirect('/cart');
        }
    );


    
});