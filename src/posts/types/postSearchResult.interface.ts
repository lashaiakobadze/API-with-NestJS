import { PostSearchBody } from './postSearchBody.interface';

export interface PostSearchResult {
  id: number;
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}
