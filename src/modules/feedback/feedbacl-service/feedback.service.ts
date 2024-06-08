import { FeedbackModel } from '../../../system';

class FeedBackService {
    async getAllFeedbacks() {
        return await FeedbackModel.find().populate({
            path: 'cardBreedsId',
            select: '-htmlDomDescription',
        });
    }
    async createFeedback(body) {
        try {
            return await FeedbackModel.create({
                feedback: body.feedback,
                links: body.links,
                feedbackNumber: body.feedbackNumber,
                cardBreedsId: body.cardBreedsId,
            });
        } catch (error) {
            throw new Error('Create feedback failed');
        }
    }
    async getFeedbackById(id) {
        try {
            return await FeedbackModel.findById(id).populate({
                path: 'cardBreedsId',
                select: '-htmlDomDescription',
            });
        } catch (error) {
            throw new Error('Feedback not found');
        }
    }
    async deleteFeedback(id) {
        try {
            return await FeedbackModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Feedback not found');
        }
    }
}

export const feedBackService = new FeedBackService();
