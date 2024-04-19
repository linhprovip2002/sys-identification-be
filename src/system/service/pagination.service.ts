import { Model, PaginateModel, Document, PaginateOptions } from 'mongoose';

class PaginationService<T extends Document> {
    private model: PaginateModel<T>;

    constructor(model: PaginateModel<T>) {
        this.model = model;
    }

    async paginate(query: any, options: PaginateOptions): Promise<any> {
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default PaginationService;
