import * as factory from "./factoryHander";
import { User } from "../models/User";

export const getAllUser = factory.getAll(User);

export const getUser = factory.getOne(User);

export const createUser = factory.createOne(User);

//Do not change passwords with this
export const updateUser = factory.updateOne(User);

export const deleteUser = factory.deleteOne(User);
