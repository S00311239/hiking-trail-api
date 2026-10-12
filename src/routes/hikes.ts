import { Router } from 'express';
import { HikeController } from '../controllers/hikes';
import { validate } from '../middleware/validate.middleware';
import { createHikeZSchema, updateHikeZSchema } from '../models/hike';

const router = Router();
const hikeController = new HikeController();

router.get('/', hikeController.getHikes);
router.get('/:id', hikeController.getHikeById);
router.post('/', validate(createHikeZSchema), hikeController.createHike);
router.put('/:id', validate(updateHikeZSchema), hikeController.updateHike);
router.delete('/:id', hikeController.deleteHike);

export default router;
