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

export const upvotePost = ({
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

  console.log(postId);
  console.log(token);

  Axios.post(
    "http://localhost:3001/posts/upvote",
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
