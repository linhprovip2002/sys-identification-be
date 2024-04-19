import { ICategory, CategoryModel, IProduct } from '../../../system/model';
import { createProductsService } from '../../product/product-service';
class CategoryService {
    async getAllCategories() {
        try {
            const categories = await CategoryModel.find({}).lean();
            return categories;
        } catch (error) {
            throw error;
        }
    }
    async createCategory(category) {
        try {
            const newCategory = await CategoryModel.create(category);
            return newCategory;
        } catch (error) {
            throw error;
        }
    }
    async getCategoryById(id, page?, limit?) {
        try {
            const res = await createProductsService.getProductsByCategory(
                id,
                page,
                limit,
            );
            return res;
        } catch (error) {
            throw error;
        }
    }
}
export const categoryService = new CategoryService();
