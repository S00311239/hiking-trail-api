import { Router } from 'express';
import { ReviewController } from '../controllers/reviews';
import { validate } from '../middleware/validate.middleware';
import { createReviewZSchema } from '../models/review';

const router = Router();
const reviewController = new ReviewController();

router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', validate(createReviewZSchema), reviewController.createReview);
router.put('/:id', validate(createReviewZSchema), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;
