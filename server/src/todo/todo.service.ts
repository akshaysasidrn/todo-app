// src/todo/todo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  findOne(id: number): Promise<Todo> {
    return this.todoRepository.findOne({ where: { id } });
  }

  async create(title: string): Promise<Todo> {
    const todo = new Todo();
    todo.title = title;
    return this.todoRepository.save(todo);
  }

  async update(id: number, isCompleted: boolean): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    todo.isCompleted = isCompleted;
    return this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
