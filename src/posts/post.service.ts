/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { RatingPostDto } from './dto/rating.dto';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Like, Repository } from 'typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { RatingEntity } from 'src/rating/entities/rating.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { Role } from 'src/shared/enums/role.enum';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { RequireEntity } from 'src/requires/entities/require.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(RequireEntity)
    private readonly requireRepository: Repository<RequireEntity>,
  ) {}

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: Like(`%${query.keyword}%`),
        }
      : {};

    const [result, total] = await this.postRepository.findAndCount({
      where: keyword,
      relations: {
        type_of_post: true,
        require: true,
        ratings: {
          userId: true,
        },
        company: {
          work_place: {
            address: true,
          },
        },
        applies: {
          post: true,
          resume: {
            applicant: {
              user: true
            }
          }
        },
        createBy: {
          packages: true,
          user: true,
        },
      },
      select: {
        type_of_post: {
          title: true,
          slug: true,
          description: true,
        },
        require: {
          sex: true,
          age: true,
          description: true,
          quantity: true,
          experience: true,
        },
        company: {
          title: true,
          contact: {},
          work_place: {
            coordinate: true,
            latitude: true,
            address: {
              national: true,
              city: true,
              district: true,
              village: true,
            },
          },
        },
        createBy: {
          account_pay: true,
          news: true,
          packages: {
            news_quantity: true,
            payments: true,
            price: true,
          },
          user: {
            username: true,
            email: true,
            role: true,
          },
        },
        ratings: {
          id: true,
          star: true,
          comment: true,
          userId: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all post successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async findById(id: number): Promise<ApiResponseDto<PostEntity>> {
    const room = await this.postRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        type_of_post: true,
        require: true,
        ratings: {
          userId: true,
        },
        company: {
          work_place: {
            address: true,
          },
        },
        createBy: {
          packages: true,
          user: true,
        },
      },
      select: {
        type_of_post: {
          title: true,
          slug: true,
          description: true,
        },
        require: {
          sex: true,
          age: true,
          description: true,
          quantity: true,
          experience: true,
        },
        company: {
          title: true,
          contact: {},
          work_place: {
            coordinate: true,
            latitude: true,
            address: {
              national: true,
              city: true,
              district: true,
              village: true,
            },
          },
        },
        createBy: {
          account_pay: true,
          news: true,
          packages: {
            news_quantity: true,
            payments: true,
            price: true,
          },
          user: {
            username: true,
            email: true,
            role: true,
          },
        },
        ratings: {
          id: true,
          star: true,
          comment: true,
          userId: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!room) {
      throw new NotFoundException('Not found room by id');
    }
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get a room successfully',
      data: room,
    };
  }

  async create(
    createPostDto: any,
    user: UserEntity,
  ): Promise<ApiResponseDto<PostEntity>> {
    if (user.role[0] !== Role.MANAGER) {
      throw new NotAcceptableException(
        'You must be manager role, created new room',
      );
    }
    const findUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { manager: true },
    });

    const findCategoryAlready = await this.categoryRepository.findOne({
      where: {
        id: createPostDto.type_of_post,
      },
      relations: {
        posts: true,
      },
    });

    const findCompanyAlready = await this.companyRepository.findOne({
      where: {
        id: createPostDto.company,
      },
      relations: {
        posts: true,
      },
    });

    if (!findCategoryAlready) {
      throw new NotFoundException('Not found post of category');
    }

    if (!findCompanyAlready) {
      throw new NotFoundException('Not found post of company');
    }

    if (!createPostDto.require) {
      throw new BadRequestException('Not found require');
    }

    const newRequire = this.requireRepository.create({
      sex: createPostDto.require.sex,
      age: createPostDto.require.age,
      experience: createPostDto.require.experience,
      quantity: createPostDto.require.quantity,
      description: createPostDto.require.description,
    });
    await this.requireRepository.save(newRequire);

    const findCreateByUser = await this.managerRepository.findOne({
      where: {
        id: findUser.manager.id,
      },
      relations: {
        posts: true,
      },
    });

    const newPost = this.postRepository.create({
      title: createPostDto.title,
      description: createPostDto.description,
      company: findCompanyAlready,
      type_of_post: findCategoryAlready,
      require: newRequire,
      duration: createPostDto.duration,
      createBy: findCreateByUser,
    });
    await this.postRepository.save(newPost);

    if (!findCategoryAlready.posts) {
      findCategoryAlready.posts = [newPost];
    } else {
      const postAlreadyExisted = findCategoryAlready.posts.some(
        (postIntiCate) => postIntiCate.id === newPost.id,
      );
      if (!postAlreadyExisted) {
        findCategoryAlready.posts = [...findCategoryAlready.posts, newPost];
      }
    }

    await this.categoryRepository.save(findCategoryAlready);

    if (!findCompanyAlready.posts) {
      findCompanyAlready.posts = [newPost];
    } else {
      const postAlreadyExisted = findCompanyAlready.posts.some(
        (postIntiCate) => postIntiCate.id === newPost.id,
      );
      if (!postAlreadyExisted) {
        findCompanyAlready.posts = [...findCompanyAlready.posts, newPost];
      }
    }

    if (!findCreateByUser.posts) {
      findCreateByUser.posts = [newPost];
    } else {
      const userAlreadyExisted = findCreateByUser.posts.some(
        (postIntoUser) => postIntoUser.id === newPost.id,
      );
      if (!userAlreadyExisted) {
        findCreateByUser.posts = [...findCreateByUser.posts, newPost];
      }
    }

    await this.managerRepository.save(findCreateByUser);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Create new post successfully',
      data: newPost,
    };
  }

  async updateById(id: number, post: any): Promise<ApiResponseDto<any>> {
    const findPostAlready = await this.postRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        company: true,
        require: true,
        applies: true,
        createBy: true,
      },
    });
    if (!findPostAlready) {
      throw new NotFoundException('Not found post by id');
    }
    if (!post) {
      throw new BadRequestException('Not found body');
    }
    const data: any = await this.postRepository.update(id, post!);
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Update successfully',
      data: data,
    };
  }

  async removeById(id: number, status: any): Promise<ApiResponseDto<any>> {
    const findPostAlready = await this.postRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        type_of_post: true,
      },
    });
    if (!findPostAlready) {
      throw new NotFoundException('Not found post by id');
    }
    if (!status) {
      throw new BadRequestException('Not found body');
    }
    const data: any = await this.postRepository.update(id, status!);

    const category: any = await this.categoryRepository.findOne({
      where: { id: findPostAlready.id },
      relations: { posts: true },
    });

    if (!category.posts) {
      throw new NotFoundException('Not room into categories');
    }

    category.posts.map((post: { id: number }) => {
      if (post.id === findPostAlready.id) {
        category.posts.pop(post);
      }
    });

    await this.categoryRepository.save(category);

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Remove post into database successfully',
      data: data,
    };
  }

  async approvedById(id: number, status: any): Promise<ApiResponseDto<any>> {
    const findPostAlready = await this.postRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        type_of_post: true,
      },
    });
    if (!findPostAlready) {
      throw new NotFoundException('Not found post by id');
    }
    if (!status) {
      throw new BadRequestException('Not found body');
    }
    const data: any = await this.postRepository.update(id, status!);

    const category: any = await this.categoryRepository.findOne({
      where: { id: findPostAlready.id },
      relations: { posts: true },
    });

    if (!category.posts) {
      throw new NotFoundException('Not post into categories');
    }

    if (!category.posts) {
      category.posts = [findPostAlready];
    } else {
      const postAlreadyExisted = category.posts.some(
        (postIntiCate: { id: number }) =>
          postIntiCate.id === findPostAlready.id,
      );
      if (!postAlreadyExisted) {
        category.posts = [...category.posts, findPostAlready];
      }
    }

    await this.categoryRepository.save(category);

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Approved post into database successfully',
      data: data,
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<any>> {
    const findRoomAlready: PostEntity = await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!findRoomAlready) {
      throw new NotFoundException('Not found room by id');
    }

    const category: any = await this.categoryRepository.findBy({
      id: findRoomAlready.type_of_post.id,
    });

    const result = await this.postRepository.delete(id);

    if (!category.posts) {
      throw new NotFoundException('Not room into categories');
    }

    category.posts.map((room: { id: number }) => {
      if (room.id === findRoomAlready.id) {
        category.room.pop(room);
      }
    });

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Delete successfully',
      data: result,
    };
  }

  async rating(
    ratingPostDto: RatingPostDto,
    user: UserEntity,
  ): Promise<ApiResponseDto<PostEntity>> {
    const findUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!ratingPostDto) {
      throw new BadRequestException('Not found.');
    }

    const findPost = await this.postRepository.findOne({
      where: { id: ratingPostDto.postId },
      relations: { ratings: true },
    });

    if (!findPost) {
      throw new NotFoundException('Not found any room.');
    }

    const ratedStar: RatingEntity = this.ratingRepository.create({
      ...ratingPostDto,
      star: ratingPostDto.star,
      comment: ratingPostDto.comment,
      post: findPost,
      userId: findUser,
    });

    await this.ratingRepository.save(ratedStar);

    // const alreadyRated = findPost.ratings.find(
    //   (user) => user.userId.id === findUser.id,
    // );

    findPost.ratings = findPost.ratings
      ? [...findPost.ratings, ratedStar]
      : [ratedStar];

    await this.postRepository.save(findPost);

    const totalR = findPost.ratings.length;
    const ratingSum = findPost.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(ratingSum / totalR);

    findPost.totalRating = actualRating;

    await this.postRepository.save(findPost);

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Rating successfully',
      data: findPost,
    };
  }

  async addToWishlist(id: number, user: UserEntity): Promise<ApplicantEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        applicant: true,
        manager: true,
      },
    });
    console.log('user: =>', findUser);

    const findRoom = await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
    const tenantId = findUser.applicant;

    const findTenantModel = await this.applicantRepository.findOne({
      where: { id: tenantId.id },
      relations: { wishlists: true },
    });

    const wishlists = findTenantModel.wishlists;

    const alreadyWishlist = findTenantModel.wishlists.some(
      (room) => room.id === findRoom.id,
    );

    if (wishlists === null) {
      findTenantModel.wishlists.push(findRoom);
      return this.applicantRepository.save(findTenantModel);
    } else {
      if (alreadyWishlist) {
        findTenantModel.wishlists = findTenantModel.wishlists.filter(
          (room) => room.id !== findRoom.id,
        );
        return this.applicantRepository.save(findTenantModel);
      } else {
        findTenantModel.wishlists.push(findRoom);
        return this.applicantRepository.save(findTenantModel);
      }
    }
  }

  async saves(id: number, user: UserEntity): Promise<ApplicantEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        applicant: true,
        manager: true,
      },
    });

    const findRoom = await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
    const tenantId = findUser.applicant;

    const findTenantModel = await this.applicantRepository.findOne({
      where: { id: tenantId.id },
      relations: { saves: true },
    });

    const saves = findTenantModel.saves;

    const alreadySave = findTenantModel.saves.some(
      (room) => room.id === findRoom.id,
    );

    if (saves === null) {
      findTenantModel.saves.push(findRoom);
      return this.applicantRepository.save(findTenantModel);
    } else {
      if (alreadySave) {
        findTenantModel.saves = findTenantModel.saves.filter(
          (room) => room.id !== findRoom.id,
        );
        return this.applicantRepository.save(findTenantModel);
      } else {
        findTenantModel.saves.push(findRoom);
        return this.applicantRepository.save(findTenantModel);
      }
    }
  }

  async follower(id: number, user: UserEntity): Promise<ApplicantEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        applicant: true,
        manager: true,
      },
    });

    const follower = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    const tenantId = findUser.applicant;

    const findTenantModel = await this.applicantRepository.findOne({
      where: { id: tenantId.id },
      relations: { followers: true },
    });

    const followers = findTenantModel.followers;

    const alreadyFollower = findTenantModel.followers.some(
      (fl) => fl.id === follower.id,
    );

    if (followers === null) {
      findTenantModel.followers.push(follower);
      return this.applicantRepository.save(findTenantModel);
    } else {
      if (alreadyFollower) {
        findTenantModel.followers = findTenantModel.followers.filter(
          (fl) => fl.id !== follower.id,
        );
        return this.applicantRepository.save(findTenantModel);
      } else {
        findTenantModel.followers.push(follower);
        return this.applicantRepository.save(findTenantModel);
      }
    }
  }
}
