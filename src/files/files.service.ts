import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from "fs"; 

@Injectable()
export class FilesService {
    constructor(private readonly config: ConfigService) {
    }

    convertName(filename: string) {
      return `file_${(new Date).getTime()}_${filename}`
            .split(" ")
            .join("_")
            .split("/")
            .join("_")
            .split("\\")
            .join("_")
            .split("#")
            .join("_")
    }

    async uploadMesImage(file: Express.Multer.File) { 
        try {
            let filename = this.convertName(file.originalname);

            let dir = "uploads/messages/images";
            let pathCore = `http://${this.config.get("ip")}:${this.config.get("port")}/static/messages/images`
        
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
          let filename =  this.convertName(file.originalname);
            
          let dir = "uploads/messages/files";
          let pathCore = `http://${this.config.get("ip")}:${this.config.get("port")}/static/messages/files`

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
