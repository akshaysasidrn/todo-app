import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/todo/todo.entity';
import { ITodoService } from './types';
import { loadImplementation } from '@ce/helpers/adapter.helper';

@Injectable()
export class TodoService implements OnModuleInit {
  private implementation: ITodoService;

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}
  async onModuleInit() {
    this.implementation = await loadImplementation(__dirname, 'todo.service');
  }

  async create(title: string): Promise<Todo> {
    return await this.implementation.create(this.todoRepository, title);
  }

  async findAll(): Promise<Todo[]> {
    return await this.implementation.findAll(this.todoRepository);
  }

  async findOne(id: number): Promise<Todo> {
    return await this.implementation.findOne(this.todoRepository, id);
  }

  async update(id: number, isCompleted: boolean, title: string): Promise<Todo> {
    return await this.implementation.update(
      this.todoRepository,
      id,
      isCompleted,
      title,
    );
  }

  async remove(id: number): Promise<void> {
    return await this.implementation.remove(this.todoRepository, id);
  }
}
