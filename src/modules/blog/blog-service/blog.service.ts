import PaginationService from '../../../system/service/pagination.service';
import { IUser, UserModel, IBlog, BlogModel } from '../../../system/model';
// import { logger } from 'system/logging/logger';
class BlogService {
    private paginationService: PaginationService<IBlog>;

    constructor(ProductModel: any) {
        this.paginationService = new PaginationService<IBlog>(BlogModel);
    }
    async getBlogs(blogQuery: any) {
        try {
            let query: any = {};
            if (blogQuery.search) {
                query.$text = { $search: blogQuery.search };
            }

            let sortOptions: any = {};
            if (blogQuery.sort) {
                sortOptions = blogQuery.sort;
            }

            const options = {
                page: blogQuery.page || 1,
                limit: blogQuery.limit || 10,
                sort: sortOptions,
                populate: [{ path: 'category', select: 'name' }],
            };
            const paginatedResult = await this.paginationService.paginate(
                query,
                options,
            );

            return paginatedResult;
        } catch (error) {
            throw error;
        }
    }
    async getById(id: string) {
        try {
            return await BlogModel.findById(id)
                .lean()
                .populate({ path: 'category', select: 'name' });
        } catch (error) {
            throw error;
        }
    }
    async updateBlog(id: string, blog: any) {
        try {
            const updatedBlog = await BlogModel.findByIdAndUpdate(id, blog, {
                new: true,
            });
            return updatedBlog;
        } catch (error) {
            throw error;
        }
    }
    async createBlog(blog: any) {
        try {
            const newBlog = new BlogModel(blog);
            await newBlog.save();
            return newBlog;
        } catch (error) {
            throw error;
        }
    }
    async deleteBlog(id: string) {
        try {
            await BlogModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

export const CreateBlogService = new BlogService(BlogModel);
