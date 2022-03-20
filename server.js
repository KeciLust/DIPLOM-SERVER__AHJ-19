const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 7070;
const Router = require('koa-router');
const router = new Router();
//const WS = require('ws');
const server = http.createServer(app.callback());
const path = require('path');
const fs = require('fs');
const public = path.join(__dirname,
    '/public')
//const wsServer = new WS.Server({ server });
const file = [];





app.use(koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
    }));
    




app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
    return await next();
    }
    const headers = { 'Access-Control-Allow-Origin': '*', };
    if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
    return await next();
    } catch (e) {
    e.headers = { ...e.headers, ...headers };
    throw e;
    }
    }
    if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
    ...headers,
    'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
    ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
    
    }
    });
    
    router.get('/file', async ctx => {
        ctx.response.body = file;
    });
     router.post('/file/:id', async ctx => {
         const i = file.findIndex(({id}) => id === ctx.params.id)
          file[i].img = ctx.request.body;
          console.log(file[i]);
          ctx.response.body = file[i];
     });
    router.post('/file', async ctx => {
        const id = uuidv4()
        file.push({...ctx.request.body,id: id});
        ctx.response.body = {id: `${id}`};
        console.log(ctx.request.body);
    });
    router.delete('/file/:id', async ctx => {
        const index = file.findIndex(({ id }) => id === ctx.params.id);
        if (index !== -1) {
            file.splice(index, 1);
         }; 
        ctx.response.status = 204;
    });
    router.patch('/file/:id', async ctx => {
         const index = file.findIndex(({ id }) => id === ctx.params.id);
         if (index !== -1) {
          file[index] = {
              text: `${ctx.request.body.text}`,
              time: `${ctx.request.body.time}`,
              id: `${ctx.params.id}`,
              img: `${ctx.params.img}`,
          }}
         ctx.response.status = 204;
    })
                   
             app.use(router.routes());
             app.use(router.allowedMethods());
             
    //  wsServer.on('connection', (ws, req) => {
    //         const errCallback = (err) => {
    //         if (err) {
    //            console.log(err);
    //         }
    //         }
    //         ws.on('message', msg => {
    //             Array.from(wsServer.clients)
    //                 .filter(o => o.readyState === WS.OPEN)
    //                 .forEach(o => o.send(msg, errCallback));
    //             });
    //         ws.on('close', () => {
    //               console.log(wsServer.clients);
    //         });    
    //                    });
                
             

server.listen(port);

