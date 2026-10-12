
import { Request, Response } from 'express';
import { ReviewService } from '../services/reviews';

const reviewService = new ReviewService();

export class ReviewController {

    getReviews = async (_req: Request, res: Response): Promise<void> => {
        try {
            const reviews = await reviewService.getAllReviews();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching reviews', error });
        }
    };

    getReviewById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;

            const review = await reviewService.getReviewById(id);

            if (!review) {
                res.status(404).json({ message: 'Review not found' });
                return;
            }

            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching review', error });
        }
    };

    createReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const review = await reviewService.createReview(req.body);
            res.status(201).json(review);
        } catch (error) {
        if (error instanceof Error && error.message === 'Hike not found') {
            res.status(404).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: 'Error creating review' });
    }
    };

    updateReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;

            const updatedReview = await reviewService.updateReview(id, req.body);

            if (!updatedReview) {
                res.status(404).json({ message: 'Review not found' });
                return;
            }

            res.status(200).json(updatedReview);
        } catch (error) {
            res.status(500).json({ message: 'Error updating review', error });
        }
    };

    deleteReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;

            const deletedReview = await reviewService.deleteReview(id);

            if (!deletedReview) {
                res.status(404).json({ message: 'Review not found' });
                return;
            }

            res.status(200).json(deletedReview);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting review', error });
        }
    };
}
