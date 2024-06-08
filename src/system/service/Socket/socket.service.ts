import { Server } from 'socket.io';
import http from 'http';
import { userJoin } from './users';

export default function init(app: any) {
    const server = http.createServer(app);
    const io = new Server(server);

    io.on('connect', client => {
        client.on('joinRoom', ({ roomid }) => {
            const user = userJoin(client.id, roomid);
            client.join(user.room);

            client.on('message', msg => {
                client.broadcast.to(user.room).emit('message', msg);
            });
        });

        client.on('disconnect', () => {
            console.log('client has disconnected');
        });
    });
}
