import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import Axios from "axios";

interface Props {
  postId: number;
  token: string | null;
  setPostVoteScore: Function;
  postVoteScore: number;
  upVoted: boolean;
  downVoted: boolean;
  setUpVoted: Function;
  setDownVoted: Function;
  dispatch: Function;
  isLoggedIn: boolean;
}

export const upVotePost = ({
  postId,
  token,
  setPostVoteScore,
  postVoteScore,
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
    `${process.env.SERVER_HOST}/posts/upVote`,
    {
      postId,
    },
    {
      headers: {
        Authorization: token || "",
      },
    }
  )
    .then((response) => {})
    .catch((e) => {});

  if (upVoted) {
    setUpVoted(false);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore - 1)
    );
  } else if (downVoted) {
    setUpVoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore + 2)
    );
  } else {
    setUpVoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore + 1)
    );
  }
  setDownVoted(false);
};
