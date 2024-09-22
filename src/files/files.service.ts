import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from "fs"; 

@Injectable()
export class FilesService {
    constructor(private readonly config: ConfigService) {
    }

    uploadMesImage(file: Express.Multer.File) { 
        try {
            let filename = `file_${(new Date).getTime()}_${file.originalname}`.split(" ").join("_");
            let dir = "uploads/messages/images";
            let pathCore = `http://localhost:${this.config.get("port")}/static/messages/images`
        
            fs.mkdirSync(dir, {recursive: true});
        
            fs.writeFileSync(`${dir}/${filename}`, file.buffer);
        
            return {
              data: {
                file: {
                  path: `${pathCore}/${filename}`,
                  filename: filename,
                  size: file.size
                }     
              }
            } 
          } catch (error) {
            console.log(error)
        
            throw error;
          }  
    }

    uploadMesFile(file: Express.Multer.File) {
        try {
          let filename = `file_${(new Date).getTime()}_${file.originalname}`.split(" ").join("_");
          let dir = "uploads/messages/files";
          let pathCore = `http://localhost:${this.config.get("port")}/static/messages/files`


          fs.mkdirSync(dir, {recursive: true});

          fs.writeFileSync(`${dir}/${filename}`, file.buffer);

          console.log(file, 
            {
              file: {
                path: `${pathCore}/${filename}`,
                filename: filename,
                size: file.size
              }     
            });

          return {
            data: {
              file: {
                path: `${pathCore}/${filename}`,
                filename: filename,
              }     
            }
          } 
        } catch (error) {
          console.log(error)

          throw error;
        }
    }
}
