import React from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

// const TASKS = [
//   {
//     id: 1,
//     title: 'Mow the lawn',
//     isComplete: false,
//   },
//   {
//     id: 2,
//     title: 'Cook Pasta',
//     isComplete: true,
//   },
// ];

const App = () => {
  const URL = 'https://task-list-api-c17.herokuapp.com/tasks';

  const [tasksList, setTasksList] = useState([]);

  useEffect(() => {
    axios
      .get(URL)
      .then((response) => {
        console.log(response);
        const taskAPIResCopy = response.data.map((task) => {
          return {
            id: task.id,
            title: task.title,
            isComplete: task.is_complete,
          };
        });
        console.log(taskAPIResCopy);
        setTasksList(taskAPIResCopy);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateComplete = (taskId, isComplete) => {
    console.log('update task called');

    const completionURL = isComplete
      ? `${URL}/${taskId}/mark_incomplete`
      : `${URL}/${taskId}/mark_complete`;

    axios
      .patch(completionURL)
      .then(() => {
        const newTasksList = tasksList.map((task) => {
          if (task.id === taskId) {
            return { ...task, isComplete: !task.isComplete };
          } else {
            return task;
          }
        });
        setTasksList(newTasksList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTask = (taskId) => {
    console.log(`inside deleteTask, ${taskId}`);
    const newTasksList = [];
    axios
      .delete(`${URL}/${taskId}`)
      .then(() => {
        for (const task of tasksList) {
          if (task.id !== taskId) {
            newTasksList.push(task);
          }
        }
        setTasksList(newTasksList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>
          <TaskList
            tasks={tasksList}
            updateComplete={updateComplete}
            deleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
