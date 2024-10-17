import React from 'react';
import { TodoListProps } from './TodoListProps';
import withEditionLoader from '../helpers/withEditionLoader';

const TodoList: React.FC<TodoListProps> = (props) => {
  // This component doesn't need to do anything as it will be replaced by the edition-specific component
  return null;
};

export default withEditionLoader(TodoList, { loadDir: 'todo', fileName: 'TodoList' });
