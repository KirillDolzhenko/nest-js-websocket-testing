import { Module } from "@nestjs/common";
import configuration from "./configuration";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
        envFilePath: 
          [
            `./src/config/env/database.env`,
            `./src/config/env/server.env`,
            `./src/config/env/jwt.env`
          ],
        load: [configuration],
        isGlobal: true
      })]
})
export class ConfigGlobalModule {}


