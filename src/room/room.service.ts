/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';
import mongoose, { } from 'mongoose';
import { Query } from 'express-serve-static-core'
import { Category } from '../category/schemas/category.schema';
import { User } from '../user/schemas/user.schema';
import { RatingPostDto } from './dto/rating.dto';
import { Tenant } from 'src/user/schemas/tenant.schema';
import { Lessor } from 'src/user/schemas/lessor.schema';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name)
        private roomModel: mongoose.Model<Room>,
        @InjectModel(Category.name)
        private categoryModel: mongoose.Model<Category>,
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        @InjectModel(Tenant.name)
        private tenantModel: mongoose.Model<Tenant>,
        @InjectModel(Lessor.name)
        private lessorModel: mongoose.Model<Lessor>
    ) { }

    async findAll(query: Query): Promise<Room[]> {

        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}

        const res = await this.roomModel
            .find(keyword)
            .limit(resPerPage)
            .skip(skip)

            .populate('typeOfRoom')
            .populate('createBy')

        return res
    }

    async findById(id: string): Promise<Room> {
        return this.roomModel.findById(id)
    }

    async create(room: Room, user: User): Promise<Room> {
        const data = await Object.assign(room, user)

        const findCategory = await this.categoryModel.findById(room.typeOfRoom)

        if (!findCategory) {
            throw new NotFoundException('Not found room of category')
        }

        const res = await this.roomModel.create(data)

        await findCategory.updateOne({
            $push: {
                rooms: res._id
            }
        })

        return res
    }

    async updateById(
        id: string,
        room: Room
    ): Promise<Room> {
        return this.roomModel.findByIdAndUpdate(id, room, { new: true })
    }

    async deleteById(
        id: string
    ): Promise<Room> {

        const findRoom = await this.roomModel.findOne({ _id: id })
        const findCategory = await this.categoryModel.findById(findRoom.typeOfRoom)

        if (!findCategory) {
            throw new NotFoundException('Not found room of category.')
        }

        const res = await this.roomModel.findByIdAndDelete(id, { new: true })

        await findCategory.updateOne({
            $pull: {
                rooms: res._id
            }
        })

        return res
    }

    async rating(rating: RatingPostDto, user: User): Promise<Room> {

        const findUser = await this.userModel.findById(user)

        if (!rating) {
            throw new NotFoundException('Not found any comment.')
        }

        const findRoom = await this.roomModel.findById(rating.roomId)

        if (!findRoom) {
            throw new NotFoundException('Not found any room.')
        }

        const alreadyRated = await findRoom.ratings.find((userId) => userId.postId.toString() === findUser._id.toString())

        if (alreadyRated) {
            await findRoom.updateOne(
                {
                    ratings: {
                        elemMatch: alreadyRated
                    }
                },
                {
                    $set: {
                        "ratings.$.star": rating.star,
                        "ratings.$.comment": rating.comment,
                    }
                },
            )
        } else {
            await findRoom.updateOne(
                {
                    $push: {
                        ratings: {
                            star: rating.star,
                            comment: rating.comment,
                            postId: findUser._id
                        }
                    }
                }
            )
        }
        const getAllRatings = await this.roomModel.findById(rating.roomId)
        const totalR = getAllRatings.ratings.length
        const ratingSum = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => (prev + curr), 0)
        const actualRating = Math.round(ratingSum / totalR)
        const finalProduct = await this.roomModel.findByIdAndUpdate(rating.roomId, {
            totalRating: actualRating
        })

        return finalProduct
    }

    async addToWishlist(id: string, user: User): Promise<Tenant> {

        const findUser = await this.userModel.findById(user)
        const findRoom = await this.roomModel.findById(id)
        const tenantId = await findUser?.tenant

        const findTenantModel = await this.tenantModel.findById(tenantId)

        const alreadyWishlist = await findTenantModel.wishlists.find((id) => id === id)

        if (alreadyWishlist) {
            await findTenantModel.updateOne(
                {
                    $pull: {
                        wishlists: findRoom._id
                    }
                },
                { new: true }
            )
            return findTenantModel.save()
        } else {
            await findTenantModel.updateOne(
                {
                    $push: {
                        wishlists: findRoom._id
                    }
                },
                { new: true }
            )
            return findTenantModel.save()
        }
    }

    async saves(id: string, user: User): Promise<Tenant> {

        const findUser = await this.userModel.findById(user)
        const findRoom = await this.roomModel.findById(id)
        const tenantId = await findUser?.tenant

        const findTenantModel = await this.tenantModel.findById(tenantId)
        console.log(findTenantModel)

        const alreadySaves = await findTenantModel.saves.find((id) => id === id)
        console.log(alreadySaves, findRoom)

        if (alreadySaves) {
            await findTenantModel.updateOne(
                {
                    $pull: {
                        saves: findRoom._id
                    }
                },
                { new: true }
            )
            return findTenantModel.save()
        } else {
            await findTenantModel.updateOne(
                {
                    $push: {
                        saves: findRoom._id
                    }
                },
                { new: true }
            )
            return findTenantModel.save()
        }
    }

    async follower(id: string, user: User): Promise<Tenant> {

        const findUser = await this.userModel.findById(user)
        const findTenant = await this.tenantModel.findById(findUser?.tenant.toString())
        const findLessor = await this.lessorModel.findById(id)

        if (!findLessor) {
            throw new Error('Lessor not found');
        }

        const alreadyLessor = await findTenant.followers.some((followerId: string) => followerId.toString() === findLessor._id.toString())

        if (alreadyLessor) {
            await findTenant.updateOne({
                $pull: {
                    followers: findLessor._id
                }
            })
        } else {
            await findTenant.updateOne({
                $push: {
                    followers: findLessor._id
                }
            })
        }

        return findTenant.save()
    }

}
