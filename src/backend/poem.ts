import { NowRequest, NowResponse } from "@now/node";
import Poetess from "she-is-carmen";

const carmen = new Poetess();

const inspirationIfNecessary = async () => {
  if (
    !carmen.vocabulary ||
    Object.values(carmen.vocabulary).some(
      (words: string[]) => words.length === 0
    )
  ) {
    await carmen.inspire();
  }
};

export default async (_: NowRequest, res: NowResponse) => {
  await inspirationIfNecessary();

  res.status(201).json({
    data: {
      id: Date.now(),
      type: "poem",
      attributes: await carmen.writeBalladStanza()
    }
  });
};
