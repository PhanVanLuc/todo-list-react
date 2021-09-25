import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import EditForm from './components/EditForm';

import './App.css';
interface Todo {
  id: number;
  title: string;
  done: boolean;
  
}
function App() {
  const [todoList, setTodoList] = useState<any>([]);
  const [isDisplay, setDisplay] = useState<boolean>(false);
  const [isEditDisplay, setEditDisplay] = useState<boolean>(false);
  const [todoEdit, setTodoEdit] = useState<Todo>();


  useEffect(() => {
    fetchTodoList();
  }, []);

  async function fetchTodoList(keyword = '') {
    try {
      const requestUrl = `https://rails-api-todo-list.herokuapp.com/api/v1/todos?search=${keyword}`;
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log({ responseJSON });
      const data = responseJSON;
      console.log(data)
      setTodoList(data);
    } catch (error: any) {
      console.log('Failed to fetch post list: ', error.message);
    }
  }

  function handleTodoClick(todo: Todo) {
    fetch('https://rails-api-todo-list.herokuapp.com/api/v1/todos/' + todo.id, {
        method: 'DELETE',
      })
    .then(response => {
      const index = todoList.findIndex((x: any) => x.id === todo.id);
      if (index < 0) return;

      const newTodoList = [...todoList];
      newTodoList.splice(index, 1);
      setTodoList(newTodoList);
    })
    .catch(error => console.log(error))
    console.log(todo);
  }

  function handleRenderForm() {
    setDisplay(!isDisplay);
    setEditDisplay(false);
  }

  function handleRenderEditForm(todo: Todo) {
    setTodoEdit(todo);
    console.log(todo);
    setEditDisplay(true);
    setDisplay(false);
  }

  function handleCloseForm(){
    setDisplay(false);
    setEditDisplay(false);
  }
  async function handleTodoCheck(todo: Todo) {
    try {
      const config = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...todo, done: !todo.done}),
      }
      const res = await fetch(`https://rails-api-todo-list.herokuapp.com/api/v1/todos/${todo.id}`, config)
      const data = await res.json()
      const updatedTodoList = todoList.map((todo: any) => {
        if (todo.id === data.id) todo.done = data.done
        return todo
      })
      setTodoList(updatedTodoList);
    } catch (error) {
      console.log(error)
    }
  }

  function handleTodoFormSubmit(formValues: any){
    console.log('form submit:', formValues)
    fetch('https://rails-api-todo-list.herokuapp.com/api/v1/todos', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const newTodo = data
      const newTodoList: any = [...todoList];
      newTodoList.push(newTodo);
      setTodoList(newTodoList);
    })
    .catch(error => console.log(error))
    
  }

  async function handleEditTodoFormSubmit(formValues: any){
    try {
      const config = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...formValues, title: formValues.title, done: formValues.done }),
      }
      const res = await fetch(`https://rails-api-todo-list.herokuapp.com/api/v1/todos/${formValues.id}`, config)
      const data = await res.json()
      const updatedTodoList = todoList.map((todo: Todo) => {
        if (todo.id === data.id) 
        {
          todo.title = data.title;
          todo.done = data.done;
        }
        return todo
      })
      setTodoList(updatedTodoList);
      setEditDisplay(false);
    } catch (error) {
      console.log(error)
    }
  }

  function handleSearch(keyword: string) {
    fetchTodoList(keyword);
  }

  var elmform= (isDisplay) ? <TodoForm onSubmit={handleTodoFormSubmit} onCloseForm={handleCloseForm} /> : ''
  var editform= (isEditDisplay) ? <EditForm onSubmit={handleEditTodoFormSubmit} onCloseForm={handleCloseForm} todo={todoEdit} /> : ''  
  return (
    <div className="App container">
      <div className="text-center">
        <h1>Todo List</h1>
        <hr/>
      </div>
      <div className="row">
        {elmform}
        {editform}
        <TodoList 
          todos={todoList}
          editDisplay={isEditDisplay}
          Display={isDisplay}
          onToggleForm={handleRenderForm}
          onToggleEditForm={handleRenderEditForm}
          onTodoClick={handleTodoClick} 
          onTodoCheck={handleTodoCheck}
          onSearch={handleSearch}/>
      </div>
    </div>
  );
}

export default App;
