import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TestCaseDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  output: string;

  @IsBoolean()
  @IsNotEmpty()
  isSample: boolean;
}
