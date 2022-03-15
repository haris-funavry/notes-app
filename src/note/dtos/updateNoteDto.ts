import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  text: string;
}
