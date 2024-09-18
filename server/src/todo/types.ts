import { Todo } from './todo.entity';
import { Repository } from 'typeorm';

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
