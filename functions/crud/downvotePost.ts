interface Props {
  setPostVoteScore: Function;
  postVoteScore: number;
  upvoted: boolean;
  downvoted: boolean;
  setUpvoted: Function;
  setDownvoted: Function;
}

export const downvotePost = ({
  setPostVoteScore,
  postVoteScore,
  upvoted,
  downvoted,
  setUpvoted,
  setDownvoted,
}: Props) => {
  if (downvoted) {
    setDownvoted(false);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore + 1)
    );
  } else if (upvoted) {
    setDownvoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore - 2)
    );
  } else {
    setDownvoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore - 1)
    );
  }
  setUpvoted(false);
};
