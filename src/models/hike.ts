import { Schema, model } from 'mongoose';
import { z } from 'zod';  

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

