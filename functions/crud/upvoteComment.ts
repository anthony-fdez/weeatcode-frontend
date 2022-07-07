import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import Axios from "axios";

interface Props {
  commentId: number;
  token: string | null;
  setCommentVoteScore: Function;
  upvoted: boolean;
  downvoted: boolean;
  setUpvoted: Function;
  setDownvoted: Function;
  dispatch: Function;
  isLogedIn: boolean;
}

export const upvoteComment = ({
  commentId,
  token,
  setCommentVoteScore,
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
    "http://localhost:3001/posts/comment/upvote",
    {
      commentId,
    },
    {
      headers: {
        Authorization: token || "",
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
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore - 1)
    );
  } else if (downvoted) {
    setUpvoted(true);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore + 2)
    );
  } else {
    setUpvoted(true);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore + 1)
    );
  }
  setDownvoted(false);
};
