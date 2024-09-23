import { expect } from 'chai';
import sinon from 'sinon';
import CartController from '../src/controllers/carts.js'
import CartService from '../src/service/cartsService.js';

describe('Cart test', () => {
    let cartController;
    let cartServiceStub;
    let req;
    let res;

    beforeEach(() => {
// Se crea una solicitud nueva del CartController
    cartController = new CartController()
// Se crea un stub para CartService
    cartServiceStub = sinon.stub(CartService.prototype)

    req = {
        params: {},
        body: {},
        user: { cart: { _id: '123' } },
        session: { user: {} }
    }
    res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        render: sinon.stub()
    }
})

    afterEach(() => {
    sinon.restore(); // Se restaura los stubs
})

describe('Get cart by Id', () => {
    it('Get cart by ID', async () => {
        const fakeCart = { _id: '123', items: [] };

// Se configura stub para devolver un carrito irreal
        cartServiceStub.getCartById.resolves(fakeCart);
        await cartController.getCartById(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args[0]).to.equal('cart');
        expect(res.render.firstCall.args[1]).to.deep.equal({ cart: fakeCart });
    })
})

describe('Add item to cart', () => {
    it('Add a product to cart', async () => {
        const updatedCart = { _id: '123', items: [{ productId: '789', quantity: 1 }] };
        req.params = { cid: '123', pid: '789' };
        req.body = { quantity: 1 };

// Se configura stub para devolver un carrito actualizado
        cartServiceStub.addItemToCart.resolves(updatedCart);
        await cartController.addItemToCart(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(updatedCart)).to.be.true;
    })
})

describe('Remove item from cart', () => {
    it('Delete a product from the cart', async () => {
        const updatedCart = { _id: '12345', items: [] };
        req.params = { cid: '12345', pid: '67890' };

// Configuramos el stub para devolver el carrito actualizado
        cartServiceStub.removeItemFromCart.resolves(updatedCart);
        await cartController.removeItemFromCart(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(updatedCart)).to.be.true;
        })
    })
})