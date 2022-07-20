import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import Axios from "axios";

interface Props {
  commentId: number;
  token: string | null;
  setCommentVoteScore: Function;
  upVoted: boolean;
  downVoted: boolean;
  setUpVoted: Function;
  setDownVoted: Function;
  dispatch: Function;
  isLoggedIn: boolean;
}

export const upVoteComment = ({
  commentId,
  token,
  setCommentVoteScore,
  upVoted,
  downVoted,
  setUpVoted,
  setDownVoted,
  dispatch,
  isLoggedIn,
}: Props) => {
  if (!isLoggedIn) {
    return dispatch(setAskToLoginPopup(true));
  }

  Axios.post(
    "http://localhost:3001/posts/comment/upVote",
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

  if (upVoted) {
    setUpVoted(false);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore - 1)
    );
  } else if (downVoted) {
    setUpVoted(true);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore + 2)
    );
  } else {
    setUpVoted(true);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore + 1)
    );
  }
  setDownVoted(false);
};
