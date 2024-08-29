import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './whatsapp.service';
import { IsPublic } from 'src/auth/common/is-public.decorator';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsAppService: WhatsappService) {}

  @Get('qr')
  @IsPublic()
  async getQR(@Res() res: Response) {
    try {
      const qrDataUrl = await this.whatsAppService.getQR();
      res.type('png');
      res.send(Buffer.from(qrDataUrl.split(',')[1], 'base64'));
    } catch (error) {
      console.error('Error al obtener QR:', error);
      res.status(500).send('Error al generar QR: ' + error.message);
    }
  }
}
