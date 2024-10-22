/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Lessor } from "../schemas/lessor.schema";
import mongoose from "mongoose";


@Injectable()
export class LessorService {
    constructor(
        @InjectModel(Lessor.name)
        private lessorModel: mongoose.Model<Lessor>
    ){}

    async findAll(): Promise<Lessor[]> {
        return this.lessorModel.find()
    }
}