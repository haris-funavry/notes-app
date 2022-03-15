import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateOptions } from 'sequelize';
import { CreateNoteDto } from './dtos/createNoteDto';
import { UpdateNoteDto } from './dtos/updateNoteDto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note) private noteEntity: typeof Note) {}

  getAllNotes(): Promise<{ rows: Note[]; count: Number }> {
    return this.noteEntity.findAndCountAll<Note>();
  }

  async getNoteWithId(id: number): Promise<Note> {
    const note = await this.noteEntity.findByPk<Note>(id);

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }

  createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteEntity.create<Note>({ ...createNoteDto });
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    updateOptions: UpdateOptions<Note>,
  ): Promise<[affectedCount: number]> {
    const updateResult = await this.noteEntity.update<Note>(
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
    return this.noteEntity.destroy<Note>({ where: { id } });
  }
}
