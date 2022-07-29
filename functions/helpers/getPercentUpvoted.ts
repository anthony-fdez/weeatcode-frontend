interface Props {
  upVotes: number;
  downVotes: number;
}

export const getPercentUpVoted = ({ upVotes, downVotes }: Props): number => {
  if (upVotes === 0 && downVotes === 0) {
    return 100;
  }

  const total = upVotes + downVotes;

  const percent = (upVotes / total) * 100;

  return Math.trunc(percent);
};
