/*!
 * @author xueyangchu
 * @date 2017/7/18
 */
"use strict";

const Koa = require('koa');
const Router = require('koa-router');
const enableDestory = require('server-destroy');
const HuaBan = require('node-huaban');

const path = require('path');
const fs = require('fs');


class Server {

    constructor() {
        this.savePath = '';
        this.SERVER = new Koa();
        this.ROUTER = new Router();

        this.isOnDownload = false;
        this.app = null;

        this.setRouter();
    }

    setRouter() {
        this.ROUTER.get('/', (ctx, next) => {
            ctx.body = 'Hello World';
        }).post('/download/:type/:id', (ctx, next) => {


            let url = ctx.params.url;
            if (this.isOnDownload) {
                return ctx.body = {
                    code: 500,
                    msg: '有任务正在进行中！',
                    param: url
                }
            }

            this.isOnDownload = true;

            let board = new HuaBan(url);

            board.init().then((resolve, reject) => {
                board.title = path.join(this.savePath, board.title);
                board.downloadBoard(3, 20000, 5).then(() => {
                    this.isOnDownload = false;
                    console.log('finish!');
                });
            }).catch(error => {
                this.isOnDownload = false;
                console.error(error);
            });

            ctx.body = {
                code: 200,
                msg: '任务开始啦，准备发射啦!',
                param: url
            }
        });

        this.SERVER.use(this.ROUTER.routes());
    }

    start(savePath) {
        if (!savePath) return {
            code: 100,
            msg: '存储地址不得为空！'
        };
        try {
            fs.accessSync(savePath, fs.F_OK);
        } catch (e) {
            return {
                code: 101,
                msg: '存储目录不存在！'
            }
        }

        this.savePath = savePath;
        console.log('server strat');
        this.app = this.SERVER.listen(13888);
        enableDestory(this.app);
        return {
            code: 200,
            msg: '监控开启成功！'
        }
    }

    stop() {
        console.log('server stop');
        this.app.destroy();
        return {
            code: 200,
            msg: '监听停止！'
        }
    }
}

module.exports = new Server();
