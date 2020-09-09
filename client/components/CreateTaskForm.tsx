import React, { useState } from 'react';
import { useCreateTaskMutation } from '../generated/graphql';

interface Props {
  onTaskCreated: () => void;
}
const CreateTaskForm: React.FC<Props> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [createTask, { loading, error }] = useCreateTaskMutation({
    onCompleted: () => {
      onTaskCreated();
      setTitle('');
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading && title.trim()) {
      createTask({
        variables: {
          input: {
            title,
          },
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500  my-2">An error occurred.</p>}
      <input
        type="text"
        name="title"
        placeholder="What would you like to get done?"
        autoComplete="off"
        className="border rounded w-full p-4 outline-none text-base rounded-b-none py-5 focus:border-gray-400 focus:shadow-md"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
};

export default CreateTaskForm;
