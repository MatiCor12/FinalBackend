import { expect } from 'chai';
import sinon from 'sinon';
import ProductController from '../src/controllers/products.js';
import ProductService from '../src/service/productsService.js';

describe('Product test', () => {
    let productController;
    let productServiceStub;
    let req;
    let res;

    beforeEach(() => {
// Se crea una solicitud nueva del ProductController
    productController = new ProductController();
// Se crea un stub para ProductService
    productServiceStub = sinon.stub(ProductService.prototype);

    req = {
        params: {},
        body: {},
        query: {},
        session: { user: { role: 'admin' } }
    };
    res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    }
})

    afterEach(() => {
    sinon.restore(); // Se restaura los stubs
})

describe('Get products', () => {
    it('Get a list of products', async () => {
        const fakeProducts = { docs: [], totalPages: 1, page: 1, hasPrevPage: false, hasNextPage: false };
// Se configura el stub para devolver una lista de productos irreal
        productServiceStub.getProducts.resolves(fakeProducts);
        await productController.getProducts(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
        status: 'success',
        payload: fakeProducts.docs,
        totalPages: fakeProducts.totalPages,
        prevPage: fakeProducts.hasPrevPage ? fakeProducts.prevPage : null,
        nextPage: fakeProducts.hasNextPage ? fakeProducts.nextPage : null,
        page: fakeProducts.page,
        hasPrevPage: fakeProducts.hasPrevPage,
        hasNextPage: fakeProducts.hasNextPage
        })).to.be.true;
    })
})

describe('Add product', () => {
    it('Add a new product', async () => {
        const newProduct = { _id: '1234', name: 'Product test' };
        req.body = { name: 'Product test' };
// Se configura stub para devolver un nuevo producto
        productServiceStub.addProduct.resolves(newProduct);
        await productController.addProduct(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({ status: 'success', payload: newProduct })).to.be.true;
    })
})

describe('Update product', () => {
    it('Update a product', async () => {
        const updatedProduct = { _id: '1234', name: 'Updated product' }
        req.params = { productId: '1234' }
        req.body = { name: 'Updated product' }
// Se configura stub para actualizar el producto
        productServiceStub.updateProduct.resolves(updatedProduct)
        await productController.updateProduct(req, res)

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ status: 'success', payload: updatedProduct })).to.be.true;
    })
})

describe('Delete product', () => {
    it('Delete a product', async () => {
        req.params = { productId: '1234' };
// Se configura stub para simular una eliminacion
        productServiceStub.deleteProduct.resolves();
        await productController.deleteProduct(req, res);

        expect(res.status.calledWith(204)).to.be.true;
        expect(res.json.calledWith({ status: 'success' })).to.be.true;
        })
    })
})