import { createHikeZSchema } from "../../models/hike";

const validHike = {
    "name": "K2",
    "location": "Nepal",
    "description": "Most dangeraous mountain in the world",
    "distanceInKm": 123,
    "difficulty": "hard",
    "duration": 679
}

describe('Test Hike Validation', () => {
    it('should pass for valid Hike data', () => {
        expect(() => createHikeZSchema.parse(validHike)).not.toThrow();
    });

    it('should fail when name is missing', () => {
        expect(() => createHikeZSchema.parse(
            { ...validHike, name: undefined }
        )).toThrow();
    });

    it('should fail for invalid difficulty', () => {
        expect(() => createHikeZSchema.parse(
            { ...validHike, difficulty: 'extreme' }
        )).toThrow();
    });

    it('should fail for zero or negative distance', () => {
        expect(() => createHikeZSchema.parse(
            { ...validHike, distanceInKm: 0 }
        )).toThrow();

        expect(() => createHikeZSchema.parse(
            { ...validHike, distanceInKm: -5 }
        )).toThrow();
    });

    it('should fail when duration is missing', () => {
        expect(() => createHikeZSchema.parse(
            { ...validHike, duration: undefined }
        )).toThrow();
    });
});