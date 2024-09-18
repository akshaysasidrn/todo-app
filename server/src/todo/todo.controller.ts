import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(+id);
  }

  @Post()
  create(@Body('title') title: string): Promise<Todo> {
    return this.todoService.create(title);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body('isCompleted') isCompleted: boolean,
  ): Promise<Todo> {
    return this.todoService.update(+id, isCompleted);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(+id);
  }
}
