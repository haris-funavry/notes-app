import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  text: string;
}
