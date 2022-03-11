import { CronJob } from "cron";
import "dotenv/config";
import http from "http";
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

const server = http.createServer(function (req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!\n');
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed\n');
    }
})


server.listen(process.env.PORT || 3000)
schedule.cronJob.start();
