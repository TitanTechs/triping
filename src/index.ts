import { CronJob } from "cron";
import "dotenv/config";
import { request } from "undici";

class Schedule {
    cronJob: CronJob;

    constructor() {
        this.cronJob = new CronJob("* * * * *", async () => {
            try {
                await this.pingApis();
                await this.pingItsSelf();
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

    async pingItsSelf() {
        const { statusCode } = await request(process.env.SELF_API);

        if (statusCode !== 500) {
            console.log({ statusCode });
        }
    }
}

const schedule = new Schedule();

schedule.cronJob.start();
