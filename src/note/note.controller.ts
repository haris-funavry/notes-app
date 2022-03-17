import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/updateNoteDto';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  getAllNotes(@Req() req): Promise<{ rows: Note[] }> {
    return this.noteService.getAllNotesOfUser(req.user.userId);
  }

  @Get('/:noteId')
  getNoteWithId(@Param('noteId', ParseIntPipe) noteId: number, @Req() req) {
    return this.noteService.getNoteWithId(noteId, req.user.userId);
  }

  @Post()
  createNote(@Body() createNoteDto: CreateNoteDto, @Req() req): Promise<Note> {
    return this.noteService.createNote(createNoteDto, req.user.userId);
  }

  @Patch('/:noteId')
  updateNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Req() req,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<[affectedCount: number]> {
    return this.noteService.updateNote(updateNoteDto, {
      where: { id: noteId, userId: req.user.userId },
    });
  }

  @Delete('/:noteId')
  deleteNoteWithId(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Req() req,
  ): Promise<number> {
    return this.noteService.deleteNoteWithId(noteId, req.user.userId);
  }
}
