import { connectDatabase } from '../database.connector';
import { logger } from '../../logging/logger';
import { VariantOptionsModel } from '../../model';
async function seedPrice() {
    logger.info('seed price...');
    await connectDatabase();

    // find all variant Options has price < 1000 then get value *  1000
    const variantOptions = await VariantOptionsModel.find({
        price: { $lt: 1000 },
    });
    for (const variantOption of variantOptions) {
        variantOption.price = variantOption.price * 1000;
        await variantOption.save();
    }
    logger.info('seed price done');
    return;
}

seedPrice()
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        logger.error(error);
        process.exit(1);
    });
