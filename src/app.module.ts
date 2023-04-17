import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiModule } from './citi/citi.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:".env"
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    CitiModule,
    AuthModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
