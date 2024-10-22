/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Requirement } from "./schemas/requirement.schema";
import mongoose from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { Room } from "src/room/schemas/room.schema";


@Injectable()
export class RequirementService {
    constructor(
        @InjectModel(Requirement.name)
        private requirementModel: mongoose.Model<Requirement>,
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        @InjectModel(Room.name)
        private roomModel: mongoose.Model<Room>,
    ) { }

    async create(requirement: Requirement, user: User): Promise<Requirement> {

        const data = await Object.assign(requirement, user)
        const findUser = await this.userModel.findById(user)
        const findRoom = await this.roomModel.findById(requirement.roomId)

        const alreadyRequirement = await findRoom.requires.find((req_id) => req_id === requirement.roomId)

        const res = await this.requirementModel.create(data)
        console.log(res)

        await res.updateOne({
            $push: {
                createBy: findUser._id
            }
        })

        if (alreadyRequirement) {
            throw new Error('Id of requirement is existed.')
        }

        await findRoom.updateOne({
            $push: {
                requires: res._id
            }
        })

        return res
    }

    async findAll(): Promise<Requirement[]> {
        return this.requirementModel.find()
            .populate('createBy')
            .populate('roomId')
            .exec()
    }
}