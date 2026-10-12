
import { Request, Response } from 'express';
import { HikeService } from "../services/hikes";
import { IHike } from "../models/hike";

const hikeService = new HikeService();

export class HikeController {

    /**
     * @swagger
     * /hikes:
     *   get:
     *     summary: Get all hikes
     *     description: Retrieve all hikes, optionally filtered by difficulty.
     *     parameters:
     *       - in: query
     *         name: difficulty
     *         required: false
     *         schema:
     *           type: string
     *           enum: [easy, medium, hard]
     *         description: Filter hikes by difficulty level
     *     responses:
     *       200:
     *         description: List of hikes returned successfully
     *       500:
     *         description: Server error
     */
    getHikes = async (req: Request, res: Response): Promise<void> => {
        try {
            const difficulty = req.query.difficulty as IHike["difficulty"] | undefined;
            const hikes = await hikeService.getAllHikes(difficulty);
            res.status(200).json(hikes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hikes', error });
        }
    };

    /**
     * @swagger
     * /hikes/{id}:
     *   get:
     *     summary: Get a hike by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: MongoDB ObjectId of the hike
     *     responses:
     *       200:
     *         description: Hike returned successfully
     *       404:
     *         description: Hike not found
     *       500:
     *         description: Server error
     */
    getHikeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const hike = await hikeService.getHikeById(id);

            if (!hike) {
                res.status(404).json({ message: 'Hike not found' });
                return;
            }

            res.status(200).json(hike);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hike', error });
        }
    };

    /**
     * @swagger
     * /hikes:
     *   post:
     *     summary: Create a hike
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Hike'
     *     responses:
     *       201:
     *         description: Hike created successfully
     *       400:
     *         description: Invalid hike data
     *       500:
     *         description: Server error
     */
    createHike = async (req: Request, res: Response): Promise<void> => {
        try {
            const newHike = await hikeService.createHike(req.body);
            res.status(201).json(newHike);
        } catch (error) {
            res.status(500).json({ message: 'Error inserting into MongoDB', error });
        }
    };

    /**
     * @swagger
     * /hikes/{id}:
     *   put:
     *     summary: Update a hike
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: MongoDB ObjectId of the hike
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Hike'
     *     responses:
     *       200:
     *         description: Hike updated successfully
     *       400:
     *         description: Invalid hike data
     *       404:
     *         description: Hike not found
     *       500:
     *         description: Server error
     */
    updateHike = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updatedHike = await hikeService.updateHike(id, req.body);

            if (!updatedHike) {
                res.status(404).json({ message: 'Hike not found' });
                return;
            }

            res.status(200).json(updatedHike);
        } catch (error) {
            res.status(500).json({ message: 'Error updating hike', error });
        }
    };

    /**
     * @swagger
     * /hikes/{id}:
     *   delete:
     *     summary: Delete a hike
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: MongoDB ObjectId of the hike
     *     responses:
     *       200:
     *         description: Hike deleted successfully
     *       404:
     *         description: Hike not found
     *       500:
     *         description: Server error
     */
    deleteHike = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const deletedHike = await hikeService.deleteHike(id);

            if (!deletedHike) {
                res.status(404).json({ message: 'Hike not found' });
                return;
            }

            res.status(200).json(deletedHike);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting hike', error });
        }
    };
}
