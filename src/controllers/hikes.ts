import { Request, Response } from 'express';
import { HikeService } from "../services/hikes";
import { IHike } from "../models/hike";

const hikeService = new HikeService();

export class HikeController {

    getHikes = async (req: Request, res: Response): Promise<void> => {
        try {
            const difficulty = req.query.difficulty as IHike["difficulty"] | undefined;
            const hikes = await hikeService.getAllHikes(difficulty);
            res.status(200).json(hikes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hikes', error });
        }
    };

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

    createHike = async (req: Request, res: Response): Promise<void> => {
        try {
            const newHike = await hikeService.createHike(req.body);
            res.status(201).json(newHike);
        } catch (error) {
            res.status(500).json({ message: 'Error inserting into MongoDB', error });
        }
    };

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