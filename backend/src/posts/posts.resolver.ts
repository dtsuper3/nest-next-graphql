import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.create({ ...createPostInput, user: user.id });
  }

  @Query(() => [Post], { name: 'posts' })
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.postsService.findAll(user.id);
  }

  @Query(() => Post, { name: 'post' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.findOne(user.id, id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(updatePostInput);
  }

  @Mutation(() => Post, { nullable: true })
  @UseGuards(JwtAuthGuard)
  removePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.remove(id);
  }
}
