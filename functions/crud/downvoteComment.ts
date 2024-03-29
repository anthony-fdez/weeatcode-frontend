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
  getNewComments: Function;
}

export const downVoteComment = ({
  commentId,
  token,
  setCommentVoteScore,
  upVoted,
  downVoted,
  setUpVoted,
  setDownVoted,
  dispatch,
  isLoggedIn,
  getNewComments,
}: Props) => {
  if (!isLoggedIn) {
    return dispatch(setAskToLoginPopup(true));
  }

  Axios.post(
    `${process.env.SERVER_HOST}/posts/comment/downVote`,
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
      getNewComments();
    })
    .catch((e) => {});

  if (downVoted) {
    setDownVoted(false);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore + 1)
    );
  } else if (upVoted) {
    setDownVoted(true);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore - 2)
    );
  } else {
    setDownVoted(true);
    setCommentVoteScore(
      (commentVoteScore: number) => (commentVoteScore = commentVoteScore - 1)
    );
  }
  setUpVoted(false);
};
