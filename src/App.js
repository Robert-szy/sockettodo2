import React from 'react';
import io from 'socket.io-client';
import uuid from 'react-uuid';


class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  local = false;

  updateData(initialData) {
    console.log('before updated', initialData);

    this.setState({tasks: initialData});
    console.log('updated', this.state.tasks);
  };  

  addTask(taskData){
    console.log('addtaskdata', taskData);
    this.setState(state => ({
      tasks: this.state.tasks.concat(taskData)
    }));
    console.log('tasks', this.state.tasks);
  };

  removeTaskLocal(id) {
    this.local = true;
    this.removeTask(id);
  };

  removeTask(id) {
    console.log('removetaskId', id);
    this.setState(state =>({
      tasks: state.tasks.filter(task => task.id!==id)
    }));
    
    console.log('taskvalue', this.state.tasks);

    // emit if local, no emit if from sever
    if (this.local){
      this.local = false;
      this.socket.emit('removeTask', id );
    }
  };

  addTaskName(tName) {

    console.log('tName', tName);
    this.setState({taskName: tName});
    console.log('taskName', this.state.taskName);

  };
  
  submitForm(event) {
    event.preventDefault();

    if (this.state.taskName === '') {
      alert("Enter task content!");
    } else {
      // const data = this.state.taskName;
      const taskData = {id: uuid(), name: this.state.taskName};
      console.log('taskData object', taskData);

      this.addTask (taskData);
      this.socket.emit('addTask', taskData );
      console.log('addTaskName', taskData);
      this.setState({taskName: ''});

    //   this.addTask (this.state.taskName);
    //   this.socket.emit('addTask', this.state.taskName );
    //   console.log('addTaskName', this.state.taskName);
    //   this.setState({taskName: ''});
    };
  };

  componentDidMount() {
    this.socket = io('http://localhost:8000');

    this.socket.on('addTask', (taskData) => this.addTask(taskData));
    this.socket.on('removeTask', (taskId) => this.removeTask(taskId));
    this.socket.on('updateData', ([...initialData ]) => this.updateData(initialData));

    
  };

  render() {
    const {tasks, taskName} = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task, id) => (
              <li key={id} className="task">
                {task.name}
                <button className="btn btn--red" onClick={() =>this.removeTaskLocal(task.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              value={taskName} 
              id="task-name" 
              onChange={tName => this.addTaskName(tName.target.value)}
            />
            <button className="btn" type="submit" id="submit" onClick={event =>this.submitForm(event)}>Add</button>
          </form>

        </section>
      </div>
    );
  };
};

export default App;