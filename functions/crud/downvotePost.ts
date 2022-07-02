import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import { useAppDispatch } from "./../../redux/hooks/hooks";
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

export const downvotePost = ({
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
