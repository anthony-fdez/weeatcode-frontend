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
  getNewComments,
}: Props) => {
  if (!isLoggedIn) {
    return dispatch(setAskToLoginPopup(true));
  }

  Axios.post(
    `${process.env.SERVER_HOST}/posts/comment/upVote`,
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
      getNewComments();
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
