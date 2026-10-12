import { Schema, model } from 'mongoose';
import { z } from 'zod';  


/**
 * @swagger
 * components:
 *   schemas:
 *     Hike:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - description
 *         - distanceInKm
 *         - difficulty
 *         - duration
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         distanceInKm:
 *           type: number
 *           exclusiveMinimum: 0
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *         duration:
 *           type: number
 *           exclusiveMinimum: 0
 */

export interface IHike { 
    name: string,
    location: string,
    description: string,
    distanceInKm: number,
    difficulty: "easy" | "medium" | "hard",
    duration: number
}


const hikeSchema = new Schema<IHike>(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        distanceInKm: { type: Number, min: 0, required: true },
        duration: { type: Number, min: 0, required: true },
        difficulty: { type: String, required: true, enum: ["easy", "medium", "hard"]},
    },
    { timestamps: true }
);

export const HikeModel = model<IHike>('Hike',  hikeSchema);

// add my swagger notation here later

export const createHikeZSchema = z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    description: z.string().min(1),
    distanceInKm: z.number().positive(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    duration: z.number().positive()
})

export const updateHikeZSchema = z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    description: z.string().min(1),
    distanceInKm: z.number().positive(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    duration: z.number().positive()
})

