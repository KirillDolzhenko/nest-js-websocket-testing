import { Injectable, Get } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}



    // {
    //   fieldname: 'file',
    //   originalname: 'vlcsnap-2024-07-31-23h59m37s328.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: 'uploads/images',
    //   filename: 'vlcsnap-2024-07-31-23h59m37s328-1725724814413.png',
    //   path: 'uploads\\images\\vlcsnap-2024-07-31-23h59m37s328-1725724814413.png',
    //   size: 4872224
    // }