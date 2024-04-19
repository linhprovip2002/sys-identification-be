// Import necessary modules and models
import fs from 'fs';
import { parse } from 'csv-parse';
import { connectDatabase } from '../database.connector';
import { ProductModel, VariantOptionsModel } from '../../model'; // Import VariantOptionsModel

// CSV file paths and category IDs
const csvFiles = [
    '/home/linhprovip2002/Home/study/nam4/PBL/Server/data/do_choi_cho_meo.csv',
    '/home/linhprovip2002/Home/study/nam4/PBL/Server/data/dung_cu_ve_sinh.csv',
    '/home/linhprovip2002/Home/study/nam4/PBL/Server/data/sua_tam.csv',
    '/home/linhprovip2002/Home/study/nam4/PBL/Server/data/thuc_an_cho.csv',
    '/home/linhprovip2002/Home/study/nam4/PBL/Server/data/thuc_an_meo.csv',
];

const idCategory = [
    '660fb6a1284e112c153c8c5b',
    '660fb6da284e112c153c8c5d',
    '660fb82a284e112c153c8c5f',
    '660fb853284e112c153c8c61',
    '660fb85c284e112c153c8c63',
];

// Function to read CSV file
async function readCSVFile(filePath) {
    const parser = fs
        .createReadStream(filePath)
        .pipe(parse({ delimiter: ',' }));
    const data = [];
    for await (const record of parser) {
        data.push(record);
    }
    return data;
}

// Function to create variant options and return their IDs
async function createVariantOptions(variantOptionsData) {
    const variantOptionsIds = [];
    for (const option of variantOptionsData) {
        const { price } = option;
        // Create variant option with price
        const variantOption = await VariantOptionsModel.create({ price });
        variantOptionsIds.push(variantOption._id);
    }
    return variantOptionsIds;
}

// Function to create products and associate them with variant options
async function createProducts(csvData, categoryId) {
    const products = [];
    for (const row of csvData) {
        let [name, price, description, link_image] = row;
        price = parseFloat(price.replace(/[^\d.]/g, ''));
        if (isNaN(price)) {
            console.error('Invalid price:', price);
            continue; // Skip this row if price is not a valid number
        }

        const variantOptionsData = [{ price: price, quantity: 20 }];
        const variantOptionsIds =
            await createVariantOptions(variantOptionsData);
        products.push({
            name,
            description,
            productImage: [link_image],
            categoryID: categoryId,
            variantOptions: variantOptionsIds,
        });
    }
    await ProductModel.insertMany(products);
}

// Seed data function
async function seedData() {
    try {
        await connectDatabase();

        for (let i = 0; i < csvFiles.length; i++) {
            const categoryId = idCategory[i];
            const filePath = csvFiles[i];
            const csvData = await readCSVFile(filePath);
            await createProducts(csvData, categoryId);
        }
        console.log('Data seeding complete.');
        return;
    } catch (error) {
        console.error('Error seeding data:', error);
        return;
    }
}

// Run seeding function
seedData();
