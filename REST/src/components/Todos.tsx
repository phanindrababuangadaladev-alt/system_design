import React, { memo, useCallback, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

type TaskEntryProps = {
  addTodo: (val: string) => void;
};

type MakeDone = (id: number, status: boolean) => void;
type DeleteTodo = (val: number) => void;

const TaskEntry = ({ addTodo }: TaskEntryProps) => {
  const [task, setTask] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(task);
    setTask("");
  };
  return (
    <form noValidate autoComplete="off" onSubmit={handleAdd}>
      <InputGroup className="col-10">
        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        <Form.Control
          id="basic-addon1"
          aria-describedby="basic-addon1"
          placeholder="Enter Task"
          value={task}
          onChange={handleChange}
          autoFocus
        />
        <Button type="submit" className="col-2">
          Add
        </Button>
      </InputGroup>
    </form>
  );
};

const TaskItem = memo(
  ({
    id,
    isDone,
    task,
    makeDone,
    deleteTodo,
  }: Task & { makeDone: MakeDone; deleteTodo: DeleteTodo }) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      makeDone(id, e.target.checked);
    };

    const handleDelete = () => {
      deleteTodo(id);
    };

    return (
      <Stack direction="horizontal" gap={2} className="p-1">
        <Form.Check
          checked={isDone}
          type="checkbox"
          label={task}
          onChange={handleToggle}
        />

        <Button onClick={handleDelete} variant="danger">
          <Trash />
        </Button>
      </Stack>
    );
  },
  (prev, next) =>
    prev.id === next.id &&
    prev.isDone === next.isDone &&
    prev.task === next.task
);

const ShowTaskList = ({
  tasks,
  makeDone,
  deleteTodo,
}: {
  tasks: Task[];
  makeDone: MakeDone;
  deleteTodo: DeleteTodo;
}) => {
  return (
    <div className="py-4">
      {tasks.map((item) => (
        <TaskItem
          key={item.id}
          {...item}
          makeDone={makeDone}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
};

type Task = {
  isDone: boolean;
  task: string;
  id: number;
};

const Todos = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTodo = (task: string) => {
    if (task) {
      setTasks((prev) => [
        ...prev,
        {
          task,
          id: Date.now(),
          isDone: false,
        },
      ]);
    }
  };

  const makeDone = useCallback((id: number, status: boolean) => {
    setTasks((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, isDone: status };
        }
        return item;
      });
    });
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTasks((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  return (
    <Stack
      direction="vertical"
      style={{ paddingInline: "40px", paddingTop: "20px" }}
    >
      <TaskEntry addTodo={addTodo} />
      <ShowTaskList tasks={tasks} makeDone={makeDone} deleteTodo={deleteTodo} />
    </Stack>
  );
};

export default Todos;
