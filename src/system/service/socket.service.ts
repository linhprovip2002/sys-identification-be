import { Server } from 'socket.io';
import { createServer } from 'http';
import { logger } from '../logging/logger';
import { MessageModel, ConversationModel } from '../model';

let io;

export const initSocket = httpServer => {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    logger.debug('Socket.io initialized');

    io.on('connection', socket => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('user message to server', async data => {
            // console.log(`${socket.id}: ${data}`);
            try {
                // kiểm tra trong database có tồn tại socket id hay chưa
                const newMessage = await MessageModel.create({
                    senderId: socket.id,
                    isAdmin: false,
                    message: data,
                });

                const isExist = await ConversationModel.findOne({
                    socketId: socket.id,
                });

                if (isExist === null) {
                    const newConv = await ConversationModel.create({
                        socketId: socket.id,
                        messages: [newMessage._id],
                    });
                    io.emit('newChat', { socketId: socket.id, message: data });
                } else {
                    isExist.messages.push(newMessage);
                    isExist.updatedAt = new Date();
                    await isExist.save();
                }

                io.emit('user message to admin', {
                    socketId: socket.id,
                    message: data,
                });
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        socket.on('admin message to server', async data => {
            try {
                const { socketId, message } = data;

                const newMessage = await MessageModel.create({
                    senderId: socket.id,
                    isAdmin: true,
                    message: message,
                });

                const convesation = await ConversationModel.findOne({
                    socketId: socketId,
                });
                if (convesation !== null) convesation.messages.push(newMessage);
                convesation.updatedAt = new Date();
                await convesation.save();

                io.to(data.socketId).emit('admin message to user', data);
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        socket.on('join conversation', conversationId => {
            console.log('joining conversation:', conversationId);
            socket.join(conversationId);
        });

        // Listen for custom event from clients to log data
        socket.on('logData', data => {
            console.log('Data from client:', data);
        });
    });

    io.on('error', error => {
        console.error('Socket error:', error);
    });
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized');
    }
    return io;
};
