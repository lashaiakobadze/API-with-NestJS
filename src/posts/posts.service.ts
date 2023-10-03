import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import User from 'src/users/user.entity';
import { Repository, In, FindManyOptions,MoreThan } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import Post from './post.entity';
import PostsSearchService from './postsSearch.service';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';
import { Cache } from 'cache-manager';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: any[] = [];

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService, // fix connection to elastic search.
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    })
  }

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }
   
    const [items, count] = await this.postsRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC'
      },
      skip: offset,
      take: limit
    });
   
    return {
      items,
      count: startId ? separateCount : count
    }
  }

  async getPostsWithParagraph(paragraph: string) {
    return this.postsRepository.query(
      'SELECT * from post WHERE $1 = ANY(paragraphs)',
      [paragraph],
    );
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.find({
      where: { id },
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.find({
      where: { id },
      relations: ['author'],
    });

    if (updatedPost.length) {
      // await this.postsSearchService.update(updatedPost[0]);
      await this.clearCache();
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    await this.clearCache();
    // this.postsSearchService.indexPost(newPost);

    return newPost;
  }

  async searchForPosts(text: string, offset?: number, limit?: number, startId?: number) {
    const results = await this.postsSearchService.search(text, offset, limit, startId);
    const ids = results.results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({
      where: { id: In(ids) },
    });
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    // await this.postsSearchService.remove(id);
    await this.clearCache();
  }
}
