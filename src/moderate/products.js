import { productModel } from "../models/product.model.js";

export const getProductsModerate = async ({ limit = 2, page = 1, sort, query}) => {
    try {
        page = page == 0 ? 1 : page;
        page = Number(page);
        limit = Number(limit);
        const skip = (page-1) * limit;
        const sortOrder = { 'asc': -1, 'desc': 1 };
        sort = sortOrder[sort] || null;

        try{
            if(query)
                query = JSON.parse(decodeURIComponent(query))
        }catch (error) {
            console.log("Parsing error:", error)
            query = {}
        }

        const queryProducts = productModel.find(query).limit(limit).skip(skip).lean();
        if(sort !== null)
            queryProducts.sort({price: sort})
        const [products, totalDocs] = await Promise.all([queryProducts, productModel.countDocuments(query)])

        const totalPages = Math.ceil(totalDocs/limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage =  hasPrevPage ? page -1 : null
        const nextPage =  hasNextPage ? page +1 : null

        return {
            totalDocs,
            totalPages,
            limit,
            query:JSON.stringify(query),
            page,
            hasNextPage,
            hasPrevPage,
            prevPage,
            nextPage,
            payload: products,
        }

    } catch (error) {
        console.log('getProductsModerate -> ', error)
        throw error
    }
}

export const getProductByIdModerate = async (pid) => {
    try {
        return await productModel.findById(pid)
    } catch (error) {
        console.log('getProductByIdModerate -> ', error)
        throw error
    }
}

export const addProductModerate = async ({ title, description, price, thumbnails, code, stock, category, status}) => {
    try {
        return await productModel.create({title, description, price, thumbnails, code, stock, category, status})
    } catch (error) {
        console.log('addProductModerate ->', error)
        throw error
    }
}

export const deleteProductModerate = async (pid) => {
    try {
        return await productModel.findByIdAndDelete(pid)
    } catch (error) {
        console.log('deleteProductModerate ->', error)
        throw error
    }
}

export const updateProductModerate = async (pid, rest) => {
    try {
        return await productModel.findByIdAndUpdate(pid,{ ...rest },{ new: true })
    } catch (error) {
        console.log('updateProductModerate ->', error)
        throw error
    }
}