import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateOptions } from 'sequelize';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/updateNoteDto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note) private noteRepository: typeof Note) {}

  getAllNotes(): Promise<{ rows: Note[]; count: Number }> {
    return this.noteRepository.findAndCountAll<Note>();
  }

  async getNoteWithId(id: number): Promise<Note> {
    const note = await this.noteRepository.findByPk<Note>(id);

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }

  createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteRepository.create<Note>({ ...createNoteDto });
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

  deleteNoteWithId(id: number): Promise<number> {
    return this.noteRepository.destroy<Note>({ where: { id } });
  }
}
