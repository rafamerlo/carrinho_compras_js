// ==============================
// VARIÁVEIS
// ==============================
let cart = [];
let modalQt = 1;
let modalKey = 0;

// ==============================
// FUNÇÕES AUXILIARES
// ==============================
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// ==============================
// LISTAR PRODUTOS
// ==============================
modelsJson.map((item, index) => {

    let modelsItem = c('.models .models-item').cloneNode(true);

    modelsItem.setAttribute('data-key', index);

    modelsItem.querySelector('.models-item--img img').src = item.img;
    modelsItem.querySelector('.models-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    modelsItem.querySelector('.models-item--name').innerHTML = item.name;
    modelsItem.querySelector('.models-item--desc').innerHTML = item.description;

    // ABRIR MODAL
    modelsItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        modalQt = 1;
        modalKey = index;

        c('.modelsBig img').src = item.img;
        c('.modelsInfo h1').innerHTML = item.name;
        c('.modelsInfo--desc').innerHTML = item.description;

        // TAMANHOS
        cs('.modelsInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            } else {
                size.classList.remove('selected');
            }

            size.querySelector('span').innerHTML = item.sizes[sizeIndex];
        });

        c('.modelsInfo--actualPrice').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
        c('.modelsInfo--qt').innerHTML = modalQt;

        c('.modelsWindowArea').style.opacity = 0;
        c('.modelsWindowArea').style.display = 'flex';

        setTimeout(() => {
            c('.modelsWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.models-area').append(modelsItem);
});

// ==============================
// FECHAR MODAL
// ==============================
function closeModal() {
    c('.modelsWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.modelsWindowArea').style.display = 'none';
    }, 500);
}

cs('.modelsInfo--cancelButton, .modelsInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// ==============================
// CONTROLE DE QUANTIDADE
// ==============================
c('.modelsInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.modelsInfo--qt').innerHTML = modalQt;
    }
});

c('.modelsInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.modelsInfo--qt').innerHTML = modalQt;
});

// ==============================
// ESCOLHER TAMANHO
// ==============================
cs('.modelsInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {

        c('.modelsInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

        c('.modelsInfo--actualPrice').innerHTML =
            R$ `${modelsJson[modalKey].price[sizeIndex].toFixed(2)}`;
    });
});

// ==============================
// ADICIONAR AO CARRINHO
// ==============================
c('.modelsInfo--addButton').addEventListener('click', () => {

    let size = parseInt(c('.modelsInfo--size.selected').getAttribute('data-key'));
    let identifier = modelsJson[modalKey].id + '@' + size;

    let localId = cart.findIndex((item) => item.identifier == identifier);

    if (localId > -1) {
        cart[localId].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: modelsJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

// ==============================
// ABRIR / FECHAR CARRINHO
// ==============================
c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

// FINALIZAR COMPRA
c('.cart--finalizar').addEventListener('click', () => {
    cart = [];
    updateCart();
});

// ==============================
// ATUALIZAR CARRINHO
// ==============================
function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {

        c('aside').classList.add('show');

        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        cart.map((itemCart, index) => {

            let modelItem = modelsJson.find((item) => item.id == itemCart.id);

            subtotal += modelItem.price[itemCart.size] * itemCart.qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            cartItem.querySelector('img').src = modelItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML =
                `${modelItem.name} (${modelItem.sizes[itemCart.size]})`;

            cartItem.querySelector('.cart--item-qt').innerHTML = itemCart.qt;

            // MENOS
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (itemCart.qt > 1) {
                    itemCart.qt--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });

            // MAIS
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                itemCart.qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        });

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}