import { Global, Module } from "@nestjs/common";
import configuration from "./configuration";
import { ConfigModule } from "@nestjs/config";

@Global()
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


