import { ReviewModel, IReview } from "../models/review";
import { HikeModel } from "../models/hike";

export class ReviewService {

    async hikeExists(hikeId: string): Promise<boolean> {
        const hike = await HikeModel.findById(hikeId).select('_id').lean();
        return hike !== null;
    }

    async getAllReviews(): Promise<IReview[]> {
        return await ReviewModel.find().lean<IReview[]>().exec();
    }

    async getReviewById(id: string): Promise<IReview | null> {
        return await ReviewModel.findById(id).lean();
    }

    async createReview(reviewData: IReview): Promise<IReview> {
        const exists = await this.hikeExists(reviewData.hike.toString());

        if (!exists) {
            throw new Error('Hike not found');
        }
        const review = new ReviewModel(reviewData);
            return await review.save();
        }

    async updateReview(
        id: string,
        reviewData: Partial<IReview>
        ): Promise<IReview | null> { return await ReviewModel.findByIdAndUpdate(
            id,
            reviewData,
            { returnDocument: 'after', runValidators: true }
        ).lean();
    }

    async deleteReview(id: string): Promise<IReview | null> {
        return await ReviewModel.findByIdAndDelete(id).lean();
    }
}