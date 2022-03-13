import { CronJob } from "cron";
import "dotenv/config";
import http from "http";
import { request } from "undici";

class Schedule {
  cronJob: CronJob;

  constructor() {
    this.cronJob = new CronJob("*/5 * * * *", async () => {
      try {
        await this.pingApis();
        //TODO: Make sure it doesn't go down it's self too
        // await this.pingItsSelf();
      } catch (e) {
        console.error(e);
      }
    });

    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }

  async pingApis() {
    const { statusCode } = await request(process.env.HEROKU_API);
    if (statusCode !== 500) {
      console.log({ statusCode });
    }
  }

  //TODO: Make it ping it's self to that it won't shutdown
  // async pingItsSelf() {
  //     const { statusCode } = await request(process.env.SELF_API);

  //     if (statusCode !== 500) {
  //         console.log({ statusCode });
  //     }
  // }
}

const schedule = new Schedule();

const server = http.createServer(function (req, res) {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, World!\n");
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed\n");
  }
});

const PORT = process.env.PORT || 3333;

server.listen(PORT, function () {
  console.log(`server is listerning on port ${PORT}`);
});

schedule.cronJob.start();
