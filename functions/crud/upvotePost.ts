import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";

interface Props {
  setPostVoteScore: Function;
  postVoteScore: number;
  upvoted: boolean;
  downvoted: boolean;
  setUpvoted: Function;
  setDownvoted: Function;
  dispatch: Function;
  isLogedIn: boolean;
}

export const upvotePost = ({
  setPostVoteScore,
  postVoteScore,
  upvoted,
  downvoted,
  setUpvoted,
  setDownvoted,
  dispatch,
  isLogedIn,
}: Props) => {
  if (!isLogedIn) {
    return dispatch(setAskToLoginPopup(true));
  }

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
