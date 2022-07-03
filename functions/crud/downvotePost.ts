import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import Axios from "axios";
interface Props {
  postId: number;
  token: string | null;
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
  postId,
  token,
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

  Axios.post(
    "http://localhost:3001/posts/downvote",
    {
      postId,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  )
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });

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
