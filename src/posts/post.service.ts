/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Brackets, Repository } from 'typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/user/entities/user.entity';
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

    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .leftJoin('p.type_of_post', 'type_of_post')
      .leftJoin('p.require', 'require')
      .leftJoin('p.company', 'company')
      .leftJoin('company.work_place', 'work_place')
      .leftJoin('work_place.address', 'address')
      .leftJoinAndSelect('p.applies', 'applies')
      .leftJoin('applies.applicant', 'applicant')
      .leftJoin('applicant.user', 'applicantUser')
      .leftJoin('applies.post', 'post')
      .leftJoin('applies.resume', 'resume')
      .leftJoin('p.createBy', 'createBy')
      .leftJoin('createBy.packages', 'packages')
      .leftJoin('createBy.user', 'createUser');

    queryBuilder.addSelect(['type_of_post.title', 'type_of_post.slug']);
    queryBuilder.addSelect([
      'require.gender',
      'require.age',
      'require.experience',
      'require.level',
      'require.quantity',
      'require.education',
      'require.description',
    ]);
    queryBuilder.addSelect([
      'company.title',
      'company.logo',
      'company.scale',
      'company.information',
      'company.status',
    ]);
    queryBuilder.addSelect(['work_place.coordinate', 'work_place.latitude']);
    queryBuilder.addSelect([
      'address.national',
      'address.city',
      'address.district',
      'address.village',
    ]);

    queryBuilder.addSelect([
      'applies.letter',
      'applies.status',
      'applies.createAt',
    ]);
    queryBuilder.addSelect([
      'applicant.id',
      'applicantUser.id',
      'applicantUser.avatar',
      'applicantUser.username',
      'applicantUser.email',
      'applicantUser.role',
    ]);
    queryBuilder.addSelect(['post.title', 'post.description', 'post.views']);
    queryBuilder.addSelect([
      'resume.title',
      'resume.job',
      'resume.target',
      'resume.image',
      'resume.description',
      'resume.status',
    ]);
    queryBuilder.addSelect(['createBy.social', 'createBy.news']);
    queryBuilder.addSelect([
      'createUser.username',
      'createUser.email',
      'createUser.role',
    ]);
    queryBuilder.addSelect(['packages.price', 'packages.news_quantity']);

    // find with keyword
    if (query.titles) {
      const titles = query.titles
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('titles: ', titles);

      if (titles.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            titles.forEach((k: any, idx: any) => {
              qb.orWhere(`post.title LIKE :title${idx}`, {
                [`title${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.fields) {
      const fields = query.fields
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('fields: ', fields);

      if (fields.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            fields.forEach((k: any, idx: any) => {
              qb.orWhere(`type_of_post.title LIKE :title${idx}`, {
                [`title${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.addresses) {
      const addresses = query.addresses
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('addresses: ', addresses);

      if (addresses.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            addresses.forEach((k: any, idx: any) => {
              qb.orWhere(`address.city LIKE :city${idx}`, {
                [`city${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.workTypes) {
      const workTypes = query.workTypes
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('workTypes: ', workTypes);

      if (workTypes.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            workTypes.forEach((k: any, idx: any) => {
              qb.orWhere(`post.work_type::text LIKE :work_type${idx}`, {
                [`work_type${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }
    // pagination
    queryBuilder.take(resPerPage).skip(skip);

    const [result, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      message: 'Get all post successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async findById(id: number): Promise<ApiResponseDto<any>> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .leftJoin('p.type_of_post', 'type_of_post')
      .leftJoin('p.require', 'require')
      .leftJoin('p.company', 'company')
      .leftJoin('company.work_place', 'work_place')
      .leftJoin('work_place.address', 'address')
      .leftJoin('p.applies', 'applies')
      .leftJoin('applies.applicant', 'applicant')
      .leftJoin('applicant.user', 'applicantUser')
      .leftJoin('applies.post', 'post')
      .leftJoin('applies.resume', 'resume')
      .leftJoin('p.createBy', 'createBy')
      .leftJoin('createBy.packages', 'packages')
      .leftJoin('createBy.user', 'createUser');

    queryBuilder.addSelect(['type_of_post.title', 'type_of_post.slug']);
    queryBuilder.addSelect([
      'require.gender',
      'require.age',
      'require.experience',
      'require.level',
      'require.quantity',
      'require.education',
      'require.description',
    ]);
    queryBuilder.addSelect([
      'company.title',
      'company.logo',
      'company.scale',
      'company.information',
      'company.status',
      'work_place.coordinate',
      'work_place.latitude',
    ]);
    // queryBuilder.addSelect(['work_place.coordinate', 'work_place.latitude']);
    queryBuilder.addSelect([
      'address.national',
      'address.city',
      'address.district',
      'address.village',
    ]);
    queryBuilder.addSelect(['applies.letter', 'applies.status']);
    queryBuilder.addSelect([
      'applicantUser.username',
      'applicantUser.email',
      'applicantUser.role',
    ]);
    queryBuilder.addSelect(['post.title', 'post.description', 'post.views']);
    queryBuilder.addSelect([
      'resume.title',
      'resume.job',
      'resume.target',
      'resume.image',
      'resume.description',
      'resume.status',
    ]);
    queryBuilder.addSelect(['createBy.social', 'createBy.news']);
    queryBuilder.addSelect([
      'createUser.username',
      'createUser.email',
      'createUser.role',
    ]);
    queryBuilder.addSelect(['packages.price', 'packages.news_quantity']);

    queryBuilder.where('p.id = :id', { id: id });

    const query = await queryBuilder.getOne();

    const postItem = query;

    return {
      statusCode: HttpStatus.OK,
      message: 'Get a post successfully',
      data: postItem,
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

    const findManager = await this.managerRepository.findOne({
      where: { id: findUser.manager.id },
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

    if (findManager.news === findCompanyAlready.posts.length) {
      throw new Error('Upgrade to be the best experience.');
    }

    const newRequire = this.requireRepository.create({
      gender: createPostDto.require.gender,
      age: createPostDto.require.age,
      level: createPostDto.require.level,
      education: createPostDto.require.education,
      skill: createPostDto.require.experience,
      experience: createPostDto.require.experience,
      time: createPostDto.require.time,
      quantity: createPostDto.require.quantity,
      description: createPostDto.require.detail,
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
      salary: createPostDto.salary,
      benefit: createPostDto.benefit,
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
      message: 'Create new post successfully',
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
      message: 'Update successfully',
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
      message: 'Remove post into database successfully',
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
      message: 'Approved post into database successfully',
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
      message: 'Delete successfully',
      data: result,
    };
  }

  async addToWishlist(id: number, user: UserEntity): Promise<ApplicantEntity> {
    const findUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { applicant: true },
    });

    const findPost = await this.postRepository.findOne({ where: { id: id } });
    const applicantId = findUser.applicant;

    const findApplicant = await this.applicantRepository.findOne({
      where: { id: applicantId.id },
      relations: { wishlists: true },
    });

    const wishlists = findApplicant.wishlists;

    const alreadyWishlist = findApplicant.wishlists.some(
      (post) => post.id === findPost.id,
    );

    if (wishlists === null) {
      findApplicant.wishlists.push(findPost);
      return this.applicantRepository.save(findApplicant);
    } else {
      if (alreadyWishlist) {
        findApplicant.wishlists = findApplicant.wishlists.filter(
          (room) => room.id !== findPost.id,
        );
        return this.applicantRepository.save(findApplicant);
      } else {
        findApplicant.wishlists.push(findPost);
        return this.applicantRepository.save(findApplicant);
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

    const findPost = await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
    const applicantId = findUser.applicant;

    const findApplicant = await this.applicantRepository.findOne({
      where: { id: applicantId.id },
      relations: { saves: true },
    });

    const saves = findApplicant.saves;

    const alreadySave = findApplicant.saves.some(
      (room) => room.id === findPost.id,
    );

    if (saves === null) {
      findApplicant.saves.push(findPost);
      return this.applicantRepository.save(findApplicant);
    } else {
      if (alreadySave) {
        findApplicant.saves = findApplicant.saves.filter(
          (room) => room.id !== findPost.id,
        );
        return this.applicantRepository.save(findApplicant);
      } else {
        findApplicant.saves.push(findPost);
        return this.applicantRepository.save(findApplicant);
      }
    }
  }
}
