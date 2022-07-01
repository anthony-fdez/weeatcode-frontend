interface Props {
  setPostVoteScore: Function;
  postVoteScore: number;
  upvoted: boolean;
  downvoted: boolean;
  setUpvoted: Function;
  setDownvoted: Function;
}

export const upvotePost = ({
  setPostVoteScore,
  postVoteScore,
  upvoted,
  downvoted,
  setUpvoted,
  setDownvoted,
}: Props) => {
  if (upvoted) {
    setUpvoted(false);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore - 1)
    );
  } else if (downvoted) {
    setUpvoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore + 2)
    );
  } else {
    setUpvoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore + 1)
    );
  }
  setDownvoted(false);
};
