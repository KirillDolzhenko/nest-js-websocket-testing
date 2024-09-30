import { Socket } from 'socket.io';

export default async function sendError(client: Socket, message: string, data?: any) {
    client.emit("error", {
        type: "message",
        data,
        message
    }); 
}
 