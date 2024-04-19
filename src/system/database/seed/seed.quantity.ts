import { VariantOptionsModel, ProductModel } from '../../model';
import { connectDatabase } from '../database.connector';
async function addQuantityToVariantOptions() {
    try {
        // Tìm tất cả các bản ghi mà không có trường 'quantity'
        const optionsWithoutQuantity = await VariantOptionsModel.find({
            quantity: { $exists: false },
        });

        // Tạo một mảng các tác vụ cập nhật để thêm trường 'quantity' cho mỗi bản ghi
        const updateOperations = optionsWithoutQuantity.map(option => {
            return {
                updateOne: {
                    filter: { _id: option._id },
                    update: { $set: { quantity: 20 } },
                },
            };
        });

        // Thực hiện cập nhật cho tất cả các bản ghi cùng một lúc
        await VariantOptionsModel.bulkWrite(updateOperations);

        console.log('Quantity added to variant options where missing.');
    } catch (error) {
        console.error('Error adding quantity to variant options:', error);
    }
}
async function addHtmlDomDescription() {
    try {
        // Tìm tất cả các bản ghi mà không có trường 'htmlDomDescription'
        const productsWithoutHtml = await ProductModel.find({
            htmlDomDescription: { $exists: false },
        });

        // Tạo một mảng các tác vụ cập nhật để thêm trường 'htmlDomDescription' cho mỗi bản ghi
        const updateOperations = productsWithoutHtml.map(product => {
            return {
                updateOne: {
                    filter: { _id: product._id },
                    update: { $set: { htmlDomDescription: '' } },
                },
            };
        });

        // Thực hiện cập nhật cho tất cả các bản ghi cùng một lúc
        await ProductModel.bulkWrite(updateOperations);

        console.log('HtmlDomDescription added to products where missing.');
    } catch (error) {
        console.error('Error adding htmlDomDescription to products:', error);
    }
}

async function seedData() {
    try {
        await connectDatabase();
        await addHtmlDomDescription();
        console.log('Data seeding complete.');
        return;
    } catch (error) {
        console.error('Error seeding data:', error);
        return;
    }
}
seedData();
