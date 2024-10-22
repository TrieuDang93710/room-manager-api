/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Tenant } from "../schemas/tenant.schema";
import mongoose from "mongoose";


@Injectable()
export class TenantService {
    constructor(
        @InjectModel(Tenant.name)
        private tenantModel: mongoose.Model<Tenant>
    ) { }

    async findAll(): Promise<Tenant[]> {
        return this.tenantModel.find()
            // .populate('historys')
            // .populate('userId')
            // .populate('saves')
            // .populate('followers')
            // .populate('wishlists')
            .exec()
    }
}