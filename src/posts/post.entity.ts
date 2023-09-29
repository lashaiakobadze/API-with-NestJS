import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import User from '../users/user.entity';
import Category from '../categories/category.entity';
import Comment from '../comments/comment.entity';
@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column('simple-array')
  public paragraphs: string[];

  @Column({ nullable: true })
  public category?: string;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  public comments: Comment[];
}

export default Post;
