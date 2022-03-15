import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Note } from './entities/note.entity';

@Module({
  imports: [SequelizeModule.forFeature([Note])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
