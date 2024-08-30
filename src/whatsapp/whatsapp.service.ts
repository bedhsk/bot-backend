import { Injectable, Logger } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';

@Injectable()
export class WhatsappService {
  private client: Client;
  private qr: string | null = null;
  private qrPromise: Promise<string> | null = null;
  private readonly logger = new Logger(WhatsappService.name);

  constructor() {
    this.client = new Client({
      puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // <- this one doesn't works in Windows
          '--disable-gpu',
        ],
      },
    });

    this.client.on('qr', (qr) => {
      this.qr = qr;
      if (this.qrPromise) {
        this.qrPromise = Promise.resolve(qr);
      }
    });

    this.client.on('ready', () => {
      console.log('Cliente listo');
      this.setupMessageHandler();
    });

    this.client.initialize();
  }

  async getQR(): Promise<string> {
    if (this.qr) {
      return await qrcode.toDataURL(this.qr);
    }

    if (!this.qrPromise) {
      this.qrPromise = new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve('');
        }, 30000); // 30 segundos de timeout

        this.client.once('qr', (qr) => {
          clearTimeout(timeout);
          resolve(qr);
        });
      });
    }

    const qr = await this.qrPromise;
    if (!qr) {
      throw new Error('QR no disponible después de esperar');
    }
    return await qrcode.toDataURL(qr);
  }

  private setupMessageHandler() {
    this.client.on('message', async (message: Message) => {
      this.logger.log(`Mensaje recibido: ${message.from} ${message.body}`);
      await this.handleIncomingMessage(message);
    });
  }

  private async handleIncomingMessage(message: Message) {
    try {
      const lowerCaseBody = message.body.toLowerCase();

      if (lowerCaseBody.includes('hola')) {
        await message.reply('¡Hola! ¿En qué puedo ayudarte?');
      } else if (lowerCaseBody.includes('gatos')) {
        await message.react('😺');
      } else if (lowerCaseBody.includes('ayuda')) {
        await message.reply('Estoy aquí para ayudarte. ¿Qué necesitas?');
      } else if (lowerCaseBody.includes('gracias')) {
        await message.reply('De nada. ¡Estoy para servirte!');
      } else {
        await message.reply(
          'Lo siento, no entiendo ese comando. ¿Puedes ser más específico?',
        );
      }
    } catch (error) {
      this.logger.error('Error al manejar el mensaje:', error);
    }
  }
}
