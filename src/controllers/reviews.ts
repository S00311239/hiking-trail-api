
import { Request, Response } from 'express';
import { ReviewService } from '../services/reviews';

const reviewService = new ReviewService();

export class ReviewController {

    /**
     * @swagger
     * /reviews:
     *   get:
     *     summary: Get all reviews
     *     description: Retrieve all hiking trail reviews.
     *     responses:
     *       200:
     *         description: List of reviews returned successfully
     *       500:
     *         description: Server error
     */
    getReviews = async (_req: Request, res: Response): Promise<void> => {
        try {
            const reviews = await reviewService.getAllReviews();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching reviews', error });
        }
    };

    /**
     * @swagger
     * /reviews/{id}:
     *   get:
     *     summary: Get a review by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: MongoDB ObjectId of the review
     *     responses:
     *       200:
     *         description: Review returned successfully
     *       404:
     *         description: Review not found
     *       500:
     *         description: Server error
     */
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

    /**
     * @swagger
     * /reviews:
     *   post:
     *     summary: Create a review
     *     description: Create a review linked to an existing hike.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Review'
     *     responses:
     *       201:
     *         description: Review created successfully
     *       400:
     *         description: Invalid review data
     *       404:
     *         description: Referenced hike not found
     *       500:
     *         description: Server error
     */
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

    /**
     * @swagger
     * /reviews/{id}:
     *   put:
     *     summary: Update a review
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: MongoDB ObjectId of the review
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Review'
     *     responses:
     *       200:
     *         description: Review updated successfully
     *       400:
     *         description: Invalid review data
     *       404:
     *         description: Review not found
     *       500:
     *         description: Server error
     */
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

    /**
     * @swagger
     * /reviews/{id}:
     *   delete:
     *     summary: Delete a review
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: MongoDB ObjectId of the review
     *     responses:
     *       200:
     *         description: Review deleted successfully
     *       404:
     *         description: Review not found
     *       500:
     *         description: Server error
     */
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
