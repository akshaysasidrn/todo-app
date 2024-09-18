import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/todo/todo.entity';
import { loadImplementation } from 'src/helpers/adapter.helper';
import { join } from 'path';

export interface ITodoService {
  findAll(todoRepository: Repository<Todo>): Promise<Todo[]>;
  findOne(todoRepository: Repository<Todo>, id: number): Promise<Todo>;
  create(todoRepository: Repository<Todo>, title: string): Promise<Todo>;
  update(
    todoRepository: Repository<Todo>,
    id: number,
    isCompleted: boolean,
  ): Promise<Todo>;
  remove(todoRepository: Repository<Todo>, id: number): Promise<void>;
}

@Injectable()
export class TodoService {
  private implementation: any;

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {
    this.loadServiceImplementation();
  }

  private async loadServiceImplementation() {
    const baseModulePath = join(__dirname, 'todo.base.service');
    const edition = process.env.edition;

    const overrideModulePath = join(
      __dirname,
      '../../../../',
      `${edition}/src/todo/todo.${edition}.service`,
    );

    this.implementation = await loadImplementation(
      baseModulePath,
      overrideModulePath,
    );
  }

  async findAll(): Promise<Todo[]> {
    return this.implementation.findAll(this.todoRepository);
  }

  async findOne(id: number): Promise<Todo> {
    return this.implementation.findOne(this.todoRepository, id);
  }

  async create(title: string): Promise<Todo> {
    return this.implementation.create(this.todoRepository, title);
  }

  async update(id: number, isCompleted: boolean): Promise<Todo> {
    return this.implementation.update(this.todoRepository, id, isCompleted);
  }

  async remove(id: number): Promise<void> {
    return this.implementation.remove(this.todoRepository, id);
  }
}
