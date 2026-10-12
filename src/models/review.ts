import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';



/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - hike
 *         - rating
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         hike:
 *           type: string
 *           description: MongoDB ObjectId of the hike being reviewed
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         reviewDate:
 *           type: string
 *           format: date-time
 *           readOnly: true
 */
export interface IReview {
    hike: Types.ObjectId;
    rating: number;
    comment: string;
    reviewDate: Date;
}

const reviewSchema = new Schema<IReview>({
    hike: {
        type: Schema.Types.ObjectId,
        ref: 'Hike',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const ReviewModel = model<IReview>('Review', reviewSchema);

export const createReviewZSchema = z.object({
    hike: z.string().refine(
        (value) => Types.ObjectId.isValid(value),
        { message: 'Invalid hike ID' }
    ),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1)
});
