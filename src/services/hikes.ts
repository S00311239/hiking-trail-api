import { HikeModel, IHike } from "../models/hike";
import { HydratedDocument } from 'mongoose';

export class HikeService {

     async getAllHikes(): Promise<IHike[]> {
        return await HikeModel.find().lean(); 
      }

      async getHikeById(id: string): Promise<IHike | null> {
        return await HikeModel.findById(id).lean();
      }  

     async createHike(hikeData: IHike): Promise<HydratedDocument<IHike>> {
       const hike = new HikeModel(hikeData);
       return await hike.save();
     }
   
     async updateHike(id: string, hikeData: Partial<IHike>): Promise<IHike | null> {
       return await HikeModel.findByIdAndUpdate(id, hikeData, { returnDocument: 'after' }).lean();
     }
   
     async deleteHike(id: string): Promise<IHike | null> {
       return await HikeModel.findByIdAndDelete(id).lean();
     } 

}