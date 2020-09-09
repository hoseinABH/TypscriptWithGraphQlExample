import React, { useEffect, useContext } from 'react';
import Link from 'next/link';
import {
  Task,
  useDeleteTaskMutation,
  TasksQuery,
  TasksQueryVariables,
  TasksDocument,
  TaskStatus,
  useChangeStatusMutation,
} from '../generated/graphql';
import { TaskFilterContext } from '../pages/[status]';

interface Props {
  task: Task;
}
const TaskListItem: React.FC<Props> = ({ task }) => {
  const { status } = useContext(TaskFilterContext);

  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    update: (cache, result) => {
      const data = cache.readQuery<TasksQuery, TasksQueryVariables>({
        query: TasksDocument,
        variables: { status },
      });

      if (data) {
        cache.writeQuery<TasksQuery, TasksQueryVariables>({
          query: TasksDocument,
          variables: { status: TaskStatus.Active },
          data: {
            tasks: data.tasks.filter(
              ({ id }) => id !== result.data?.deleteTask?.id
            ),
          },
        });
      }
    },
  });

  const onDeleteHandle = () => {
    deleteTask({ variables: { id: task.id } });
  };

  const [
    changeStatus,
    { loading: changingStatus, error: changeStatusError },
  ] = useChangeStatusMutation();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus =
      task.status === TaskStatus.Active
        ? TaskStatus.Completed
        : TaskStatus.Active;
    changeStatus({
      variables: {
        id: task.id,
        status: newStatus,
      },
    });
  };

  useEffect(() => {
    if (error) {
      alert('An error occurred.');
      console.log(error.message);
    }
    if (changeStatusError) {
      alert('Could not change the task status.');
    }
  }, [error, changeStatusError]);
  return (
    <li className="flex justify-between  border-b p-4 items-center  odd:bg-gray-200 last:border-b-0">
      <div className="flex">
        <div className=" bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
          <input
            checked={task.status === TaskStatus.Completed}
            onChange={onChangeHandler}
            type="checkbox"
            className="opacity-0 absolute"
            disabled={changingStatus}
          />
          <span className="fill-current hidden font-bold text-lg text-green-500 pointer-events-none ">
            &#10003;
          </span>
        </div>

        <Link href="/update/[id]" as={`update/${task.id}`}>
          <a>{task.title}</a>
        </Link>
      </div>

      <button
        disabled={loading}
        onClick={onDeleteHandle}
        className="font-bold text-red-600 text-lg   focus:outline-none"
      >
        &times;
      </button>
      <style jsx>
        {`
          input:checked + span {
            display: block;
          }
        `}
      </style>
    </li>
  );
};

export default TaskListItem;
