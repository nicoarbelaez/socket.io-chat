// import { MessageService } from '../service/message.service';
// import { AppSocket, SocketServer } from '../types/socket.types';
// import { BaseGateway } from './base.gateway';
// import { GatewayManager } from './gateway.manager';

// export class NamespaceGateway extends BaseGateway {
//   constructor(
//     server: SocketServer,
//     gatewayManager: GatewayManager,
//     private messageService: MessageService
//   ) {
//     super(server, gatewayManager);
//   }

//   protected registerHandlers(): void {
//     this.onConnection((socket) => {
//       this.handleNamespaceJoin(socket);
//     });
//   }

//   private handleNamespaceJoin(socket: AppSocket): void {
//     socket.on(
//       'join_namespace',
//       (namespace: string, callback: (success: boolean) => void) => {
//         try {
//           // Validar namespace
//           if (!this.isValidNamespace(namespace)) {
//             return callback(false);
//           }

//           // Crear namespace dinámico si no existe
//           const dynamicNamespace = this.server.io.of(`/${namespace}`);

//           // Unir al socket al namespace
//           socket.join(`/${namespace}`);

//           // Enviar historial de mensajes
//           const history = this.messageService.getNamespaceHistory(namespace);
//           socket.emit('namespace_history', history);

//           // Configurar listeners específicos del namespace
//           this.configureNamespaceListeners(dynamicNamespace);

//           callback(true);
//         } catch (error) {
//           console.error('Error joining namespace:', error);
//           callback(false);
//         }
//       }
//     );
//   }

//   private isValidNamespace(namespace: string): boolean {
//     return /^[a-zA-Z0-9-_]+$/.test(namespace);
//   }

//   private configureNamespaceListeners(
//     namespace: import('socket.io').Namespace
//   ) {
//     if (namespace.listeners('connection').length > 0) return;

//     namespace.on('connection', (socket: AppSocket) => {
//       socket.on('namespace_message', (content: string) => {
//         const user = socket.data.user;
//         if (!user) return;

//         // Guardar mensaje
//         const message = this.messageService.addNamespaceMessage({
//           namespace: namespace.name,
//           content,
//           username: user.username,
//         });

//         // Broadcast a todos excepto al emisor
//         socket.broadcast
//           .to(namespace.name)
//           .emit('new_namespace_message', message);
//       });
//     });
//   }
// }
