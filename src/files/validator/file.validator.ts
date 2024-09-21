import { PipeTransform, Injectable, ArgumentMetadata, ForbiddenException } from '@nestjs/common';

@Injectable()
export class MessageImageValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log("smt",value)
    
    const oneMb = 10000000;

    if (value.size < oneMb) {
        if (value.mimetype.match(/\/(webp|jpeg|png|jpg|avif)/)) {
            return value;
        } else {
            throw new ForbiddenException("Unsupported file extention")
        }
    } else {
        throw new ForbiddenException("Too large file")
    }
  }
}

@Injectable()
export class MessageFileValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const Mb500 = 500000000;

    if (value.size < Mb500) {
      return value;
    } else {
        throw new ForbiddenException("Too large file")
    }
  }
}