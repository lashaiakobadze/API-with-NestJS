import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { Repository, In } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import Post from './post.entity';
import PostsSearchService from './postsSearch.service';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: any[] = [];

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService, // fix connection to elastic search.
  ) {}

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
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
    // this.postsSearchService.indexPost(newPost);

    return newPost;
  }

  async searchForPosts(text: string) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map(result => result.id);
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
  }
}
