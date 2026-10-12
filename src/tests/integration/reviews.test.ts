
import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { HikeModel } from '../../models/hike';
import { ReviewModel } from '../../models/review';

describe('Review API', () => {
    let hikeId: string;

    // Create a hike that reviews can reference
    beforeAll(async () => {
        const hike = await HikeModel.create({
            name: 'Review Test Trail',
            location: 'Wicklow, Ireland',
            description: 'Trail created for Review API tests',
            distanceInKm: 5,
            difficulty: 'easy',
            duration: 90
        });

        hikeId = hike.id;
    });

    // Clean up only the data created for this test suite
    afterAll(async () => {
        await ReviewModel.deleteMany({ hike: hikeId });
        await HikeModel.findByIdAndDelete(hikeId);
    });

    // Helper to create a review directly in the test database
    async function createTestReview() {
        return await ReviewModel.create({
            hike: new Types.ObjectId(hikeId),
            rating: 4,
            comment: 'A great trail!'
        });
    }

    describe('GET /api/v1/reviews', () => {
        it('should return 200 and an array of reviews', async () => {
            const response = await request(app)
                .get('/api/v1/reviews');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/v1/reviews/:id', () => {
        it('should return a review by ID', async () => {
            const review = await createTestReview();

            const response = await request(app)
                .get(`/api/v1/reviews/${review.id}`);

            expect(response.status).toBe(200);
            expect(response.body._id).toBe(review.id);
            expect(response.body.rating).toBe(4);
        });

        it('should return 404 when the review does not exist', async () => {
            const missingId = new Types.ObjectId().toString();

            const response = await request(app)
                .get(`/api/v1/reviews/${missingId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Review not found');
        });
    });

    describe('POST /api/v1/reviews', () => {
        it('should create a review for an existing hike', async () => {
            const response = await request(app)
                .post('/api/v1/reviews')
                .send({
                    hike: hikeId,
                    rating: 5,
                    comment: 'Beautiful scenery!'
                });

            expect(response.status).toBe(201);
            expect(response.body.rating).toBe(5);
            expect(response.body.comment).toBe('Beautiful scenery!');
            expect(response.body.hike.toString()).toBe(hikeId);
        });

        it('should reject a rating above 5', async () => {
            const response = await request(app)
                .post('/api/v1/reviews')
                .send({
                    hike: hikeId,
                    rating: 6,
                    comment: 'Invalid rating'
                });

            expect(response.status).toBe(400);
        });

        it('should reject a missing comment', async () => {
            const response = await request(app)
                .post('/api/v1/reviews')
                .send({
                    hike: hikeId,
                    rating: 4
                });

            expect(response.status).toBe(400);
        });

        it('should reject an invalid hike ID format', async () => {
            const response = await request(app)
                .post('/api/v1/reviews')
                .send({
                    hike: 'not-a-valid-object-id',
                    rating: 4,
                    comment: 'Test comment'
                });

            expect(response.status).toBe(400);
        });

        it('should return 404 if the referenced hike does not exist', async () => {
            const missingHikeId = new Types.ObjectId().toString();

            const response = await request(app)
                .post('/api/v1/reviews')
                .send({
                    hike: missingHikeId,
                    rating: 4,
                    comment: 'Test comment'
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Hike not found');
        });
    });

    describe('PUT /api/v1/reviews/:id', () => {
        it('should update an existing review', async () => {
            const review = await createTestReview();

            const response = await request(app)
                .put(`/api/v1/reviews/${review.id}`)
                .send({
                    hike: hikeId,
                    rating: 5,
                    comment: 'Updated review!'
                });

            expect(response.status).toBe(200);
            expect(response.body.rating).toBe(5);
            expect(response.body.comment).toBe('Updated review!');
        });

        it('should return 404 when updating a nonexistent review', async () => {
            const missingId = new Types.ObjectId().toString();

            const response = await request(app)
                .put(`/api/v1/reviews/${missingId}`)
                .send({
                    hike: hikeId,
                    rating: 3,
                    comment: 'Updated comment'
                });

            expect(response.status).toBe(404);
        });

        it('should reject an invalid rating when updating', async () => {
            const review = await createTestReview();

            const response = await request(app)
                .put(`/api/v1/reviews/${review.id}`)
                .send({
                    hike: hikeId,
                    rating: 10,
                    comment: 'Invalid update'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/v1/reviews/:id', () => {
        it('should delete an existing review', async () => {
            const review = await createTestReview();

            const response = await request(app)
                .delete(`/api/v1/reviews/${review.id}`);

            expect(response.status).toBe(200);
            expect(response.body._id).toBe(review.id);

            const deletedReview = await ReviewModel.findById(review.id);
            expect(deletedReview).toBeNull();
        });

        it('should return 404 when deleting a nonexistent review', async () => {
            const missingId = new Types.ObjectId().toString();

            const response = await request(app)
                .delete(`/api/v1/reviews/${missingId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Review not found');
        });
    });
});
