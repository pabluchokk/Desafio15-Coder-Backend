function generateMockProducts() {
    const mockProducts = [];
    for (let i = 1; i <= 100; i++) {
        const product = {
            _id: `product_${i}`,
            title: `Product ${i}`,
            description: `Description for product ${i}`,
            price: Math.floor(Math.random() * 100) + 1,
            stock: Math.floor(Math.random() * 100) + 1,
            category: 'Mock Category',
        };
        mockProducts.push(product);
    }
    return mockProducts;
}

export { generateMockProducts };
