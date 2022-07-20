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

export const downVotePost = ({
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
    "http://localhost:3001/posts/downVote",
    {
      postId,
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

  if (downVoted) {
    setDownVoted(false);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore + 1)
    );
  } else if (upVoted) {
    setDownVoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore - 2)
    );
  } else {
    setDownVoted(true);
    setPostVoteScore(
      (postVoteScore: number) => (postVoteScore = postVoteScore - 1)
    );
  }
  setUpVoted(false);
};
