import * as Koa from "koa";
import { KoaLoggingMiddleware as logs, Log } from "logepi";
import Poetess from "she-is-carmen";
import { WordSet } from "she-is-carmen/src/wordbot-client";

const api = new Koa();
const port = process.env.PORT || 3000;

const carmen = new Poetess();

const inspirationIfNecessary = async () => {
  if (
    !carmen.vocabulary ||
    Object.keys(carmen.vocabulary).some(
      (type: WordSet) => carmen.vocabulary[type].length === 0
    )
  ) {
    await carmen.inspire();
  }
};

(async () => {
  api.use(async (ctx: Koa.Context, next: () => Promise<void>) => {
    if (ctx.path.endsWith("poems") && ctx.method === "POST") {
      await inspirationIfNecessary();

      ctx.body = {
        data: {
          id: Date.now(),
          type: "poem",
          attributes: await carmen.writeBalladStanza()
        }
      };
    }

    next();
  });

  api.use(logs());

  api.listen(port, () => {
    Log.info("API is now ready", { tags: { port } });
  });
})();
