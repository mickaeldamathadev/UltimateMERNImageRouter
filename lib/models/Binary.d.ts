import mongoose, { Document, Types } from 'mongoose';
export interface IBinary extends Document<Types.ObjectId> {
}
export declare const Binary: mongoose.Model<IBinary, {}, {}, {}, mongoose.Document<unknown, {}, IBinary> & IBinary & Required<{
    _id: Types.ObjectId;
}>, any>;
export default Binary;
