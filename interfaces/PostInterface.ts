import { VoteInterface } from "./VoteInterface";

export interface PostInterface {
  voteScore: number;
  upVotes: number;
  downVotes: number;
  upVoted?: boolean;
  downVoted?: boolean;
  views: number;
  votes?: VoteInterface[];
  post: {
    edited: boolean;
    id: number;
    title: string;
    authorId: number;
    authorName: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    votes?: VoteInterface[];
  };
}
