import { Controller, Get, Post, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { ConfigGlobalModule } from 'src/config/config.module';
import { ConfigService } from '@nestjs/config';
import { JwtAccessGuard } from 'src/jwt/guards/access.guard';

let storageImages = multer.diskStorage(
  { 
    destination: "uploads/images",
    
    filename: (_req, file, cb) => {
      const name = file.originalname.split('.')[0].split(" ").join("-").toLowerCase();

      const date = new Date();

      const extension = extname(file.originalname);

      cb(null, `${name}-${date.getTime()}${extension}`);
    },
  }
)

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly config: ConfigService
  ) {
  }

  
  @Post("images")
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor("file", { 
    storage: storageImages,
    limits: {
      fieldSize: 5000000
    },
    fileFilter: (_req, file, cb) => {
      console.log("FFFF")
      let types = [".png",".webp",".avif",".jpeg",".jpg"]

      if (types.includes(extname(file.originalname))) {
        cb(null, true)
      } else {
        cb(new UnsupportedMediaTypeException('Only image files are allowed'), false)
      }
    },


  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file)

    return {
      data: {
        file: {
          path: `http://localhost:${this.config.get("port")}/static/images/${file.filename}`,
          filename: file.filename,
        }     
      }
    }
  }
  
}
