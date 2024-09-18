import { ITodoService } from './types';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';

export class TodoBaseService implements ITodoService {
  async findAll(todoRepository: Repository<Todo>): Promise<Todo[]> {
    return todoRepository.find();
  }

  async findOne(todoRepository: Repository<Todo>, id: number): Promise<Todo> {
    return todoRepository.findOne({ where: { id } });
  }

  async create(todoRepository: Repository<Todo>, title: string): Promise<Todo> {
    const todo = new Todo();
    todo.title = title;
    return todoRepository.save(todo);
  }

  async update(
    todoRepository: Repository<Todo>,
    id: number,
    isCompleted: boolean,
  ): Promise<Todo> {
    const todo = await todoRepository.findOne({ where: { id } });
    if (!todo) throw new Error(`Todo with id ${id} not found`);
    todo.isCompleted = isCompleted;
    return todoRepository.save(todo);
  }

  async remove(todoRepository: Repository<Todo>, id: number): Promise<void> {
    await todoRepository.delete(id);
  }
}
