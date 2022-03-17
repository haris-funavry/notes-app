import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, UpdateOptions, where } from 'sequelize';
import { User } from 'src/user/entities/user.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/updateNoteDto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note) private noteRepository: typeof Note) {}

  getAllNotesOfUser(userId: number): Promise<{ rows: Note[]; count: Number }> {
    return this.noteRepository.findAndCountAll<Note>({
      where: { userId },
      include: User,
    });
  }

  async getNoteWithId(noteId: number, userId: number): Promise<Note> {
    const note = await this.noteRepository.findOne<Note>({
      where: { id: noteId, userId },
    });

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }

  createNote(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    return this.noteRepository.create<Note>({ ...createNoteDto, userId });
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    updateOptions: UpdateOptions<Note>,
  ): Promise<[affectedCount: number]> {
    const updateResult = await this.noteRepository.update<Note>(
      updateNoteDto,
      updateOptions,
    );
    // if no rows were affected, then throw not found exception
    if (updateResult[0] === 0) {
      throw new NotFoundException();
    }

    return updateResult;
  }

  deleteNoteWithId(noteId: number, userId: number): Promise<number> {
    return this.noteRepository.destroy<Note>({ where: { id: noteId, userId } });
  }
}
