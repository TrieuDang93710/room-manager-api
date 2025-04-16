/* eslint-disable prettier/prettier */
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { HttpStatus } from "@nestjs/common";
import { ApiResponseDto } from "src/dto/response.dto";
import { Server, Socket } from "socket.io";
import { MessageEntity } from "./entities/message.entity";
import { MessageService } from "./message.service";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class AppGateway {
    constructor(
        private readonly messageService: MessageService
    ){}

    @WebSocketServer() server: Server

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: MessageEntity): Promise<ApiResponseDto<any>> {
        // const newMessage = await this.messageService.sendMessage(payload)
        return {
            statusCode: HttpStatus.OK,
            message: 'Successful',
            data: 'Hello world'
        }
    }
}