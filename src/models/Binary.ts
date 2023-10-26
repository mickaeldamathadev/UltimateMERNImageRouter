import mongoose, { Document, Types, model } from 'mongoose'

export interface IBinary extends Document<Types.ObjectId> {}

const binarySchema = new mongoose.Schema<IBinary>({})

export const Binary = model<IBinary>('Binary', binarySchema)
export default Binary
