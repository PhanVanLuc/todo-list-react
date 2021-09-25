import React, { useState } from 'react';
import PropTypes from 'prop-types';

interface Todo {
  title: string;
  done: boolean;
}

TodoForm.propTypes = {
  onSubmit: PropTypes.func,
  onCloseForm: PropTypes.func,
};

TodoForm.defaultProps = {
  onSubmit: null,
  onCloseForm: null,
}

function TodoForm(props: any) {
  const {onSubmit, onCloseForm} = props;
  const [input, setInput] = useState<Todo>({title: '', done: false});

  function handleValueChange(e: any){
    const value = e.target.value
    const name = e.target.name
    setInput({...input, [name]: value})
  }

  function handleSubmit(e: any){
    e.preventDefault();
    if(!onSubmit) return;
    const formValues = {
      title: input.title,
      done: input.done,
    }
    console.log(formValues)
    onSubmit(formValues)
    setInput({title: '', done: false})
  }

  function handleCloseForm(){
    onCloseForm()
  }

  return (
    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      <div className="card">
        <div className="card-header bg-warning">
          <div className="row">
            <div className="col-10">
              <h3 className="panel-title text-white text-left">
                Thêm Công Việc
              </h3>
            </div>
            <div className="col-2">
              <h3><span className="far fa-times-circle text-white" onClick={handleCloseForm}></span></h3>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên :</label>
              <input type="text" className="form-control" value={input.title} onChange={handleValueChange} name="title"/>
              <label>Trạng Thái :</label>
              <select className="form-control" required={true} onChange={handleValueChange} name="done">
                  <option value="0">Chưa hoàn thành</option>
                  <option value="1">Đã hoàn thành</option>
              </select>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-warning">Thêm</button>&nbsp;
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TodoForm;