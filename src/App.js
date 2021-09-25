import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import EditForm from './components/EditForm';

import './App.css';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isDisplay, setDisplay] = useState(false);
  const [isEditDisplay, setEditDisplay] = useState(false);
  const [todoEdit, setTodoEdit] = useState({});


  useEffect(() => {
    fetchTodoList();
  }, []);

  async function fetchTodoList(keyword = '') {
    try {
      const requestUrl = `http://localhost:4000/api/v1/todos?search=${keyword}`;
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log({ responseJSON });
      const data = responseJSON;
      console.log(data)
      setTodoList(data);
    } catch (error) {
      console.log('Failed to fetch post list: ', error.message);
    }
  }

  function handleTodoClick(todo) {
    fetch('http://localhost:4000/api/v1/todos/' + todo.id, {
        method: 'DELETE',
      })
    .then(response => {
      const index = todoList.findIndex(x => x.id === todo.id);
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

  function handleRenderEditForm(todo) {
    setTodoEdit(todo);
    console.log(todo.done);
    setEditDisplay(true);
    setDisplay(false);
  }

  function handleCloseForm(){
    setDisplay(false);
    setEditDisplay(false);
  }
  async function handleTodoCheck(todo) {
    try {
      const config = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...todo, done: !todo.done}),
      }
      const res = await fetch(`http://localhost:4000/api/v1/todos/${todo.id}`, config)
      const data = await res.json()
      const updatedTodoList = todoList.map(todo => {
        if (todo.id === data.id) todo.done = data.done
        return todo
      })
      setTodoList(updatedTodoList);
    } catch (error) {
      console.log(error)
    }
  }

  function handleTodoFormSubmit(formValues){
    console.log('form submit:', formValues)
    fetch('http://localhost:4000/api/v1/todos', {
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
      const newTodoList = [...todoList];
      newTodoList.push(newTodo);
      setTodoList(newTodoList);
    })
    .catch(error => console.log(error))
    
  }

  async function handleEditTodoFormSubmit(formValues){
    try {
      const config = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...formValues, title: formValues.title, done: formValues.done }),
      }
      const res = await fetch(`http://localhost:4000/api/v1/todos/${formValues.id}`, config)
      const data = await res.json()
      const updatedTodoList = todoList.map(todo => {
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

  function handleSearch(keyword) {
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
