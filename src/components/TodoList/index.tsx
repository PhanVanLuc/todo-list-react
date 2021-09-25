import React, { useState } from 'react';
import PropTypes from 'prop-types';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

TodoList.propTypes = {
  todos: PropTypes.array,
  onTodoClick: PropTypes.func,
  onTodoCheck: PropTypes.func,
  onToggleForm: PropTypes.func,
  onToggleEditForm: PropTypes.func,
  onSearch: PropTypes.func,
  Display: PropTypes.bool,
  editDisplay: PropTypes.bool
};

TodoList.defaultProps = {
  todos: [],
  onTodoClick: null,
  onTodoCheck: null,
  onToggleForm: null,
  onToggleEditForm: null,
  onSearch: () => {},
  Display: false,
  editDisplay: false
};

function TodoList(props: any) {
  const { todos, onTodoClick, onTodoCheck, onToggleForm, Display, editDisplay, onToggleEditForm, onSearch } = props;
  const [keyword, setKeyword] = useState<string>('');

  function handleClick(todo: Todo) {
    if (onTodoClick) {
      onTodoClick(todo);
    }
  }

  function handleCheck(todo: Todo) {
    //if (onTodoCheck) {
      onTodoCheck(todo);
    //}
  }

  function handleToggleForm() {
    onToggleForm()
  }

  function handleToggleEditForm(todo: Todo) {
    onToggleEditForm(todo)
  }

  function handleValueChange(e: any){
    const value = e.target.value
    setKeyword(value)
  }

  function handleSearch() {
    onSearch(keyword)
  }

  function handleClear() {
    setKeyword('')
    onSearch('')
  }

  return (
    <div className={ (editDisplay||Display) ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
      <div className="row">
        <button className="btn btn-primary" type="button" onClick={() => handleToggleForm()}>Thêm công việc</button>
      </div>
      <div className="row mt-2">
        <div className="input-group">
          <button className="btn btn-primary" type="submit" onClick={() => handleClear()}>x</button>
          <input value={keyword} type="text" className="form-control" name="search" placeholder="Nhập từ khóa..." onChange={handleValueChange}/>
          <span className="input-group-btn">
            <button className="btn btn-primary" type="submit" onClick={() => handleSearch()}>Tìm</button>
          </span>
        </div>
      </div>
      <div className="row">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên công việc</th>
              <th scope="col" className="text-center">Trạng thái</th>
              <th scope="col" className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo: Todo, index: any) => (
              <tr key={todo.id}>
                <th scope="row">{index+1}</th>
                <td>{todo.title}</td>
                <td className="text-center"><input checked={todo.done ? true : false} type="checkbox" id={todo.id.toString()} onChange={() => handleCheck(todo)} /></td>
                <td className="text-center">
                  <button className="btn btn-danger" onClick={() => handleClick(todo)}>Xóa</button>
                  <button className="btn btn-primary" type="button" onClick={() => handleToggleEditForm(todo)}>Sửa</button>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TodoList;