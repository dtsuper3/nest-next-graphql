import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  create(createPostInput: CreatePostInput) {
    console.log(createPostInput);
    return this.postRepository.save({
      ...createPostInput,
      user: createPostInput.user as any,
    });
  }

  findAll(userId: number) {
    return this.postRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  findOne(userId: number, id: number) {
    return this.postRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id,
      },
      relations: ['user'],
    });
  }

  async update(updatePostInput: UpdatePostInput) {
    const { body, id } = updatePostInput;
    await this.postRepository.update(
      {
        id,
      },
      {
        body,
      },
    );

    return this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }

  async remove(id: number) {
    await this.postRepository.delete({ id });
    return null;
  }
}
