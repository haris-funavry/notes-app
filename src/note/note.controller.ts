import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/updateNoteDto';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  getAllNotes(): Promise<{ rows: Note[] }> {
    return this.noteService.getAllNotes();
  }

  @Get('/:id')
  getNoteWithId(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.getNoteWithId(id);
  }

  @Post()
  createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteService.createNote(createNoteDto);
  }

  @Patch('/:id')
  updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<[affectedCount: number]> {
    return this.noteService.updateNote(updateNoteDto, { where: { id } });
  }

  @Delete('/:id')
  deleteNoteWithId(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.noteService.deleteNoteWithId(id);
  }
}
