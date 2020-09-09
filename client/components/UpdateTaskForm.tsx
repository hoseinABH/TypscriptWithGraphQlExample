import React, { useState, useEffect } from 'react';
import { useUpdateTaskMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface Values {
  id: number;
  title: string;
}
interface Props {
  initialValues: Values;
}
const UpdateTaskForm: React.FC<Props> = ({ initialValues }) => {
  const [updateTask, { loading, error, data }] = useUpdateTaskMutation();
  const [values, setValues] = useState<Values>(initialValues);
  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTask({
      variables: {
        input: values,
      },
    });
  };

  const router = useRouter();

  useEffect(() => {
    if (data && data.updateTask) {
      router.push('/');
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500  my-2">An error occurred.</p>}
      <p>
        <label className="mb-2 block">Title</label>
        <input
          type="text"
          name="title"
          className="border rounded w-full p-4 outline-none text-base  focus:border-gray-400 focus:shadow-md"
          value={values.title}
          onChange={onChangeHandle}
        />
      </p>
      <p>
        <button
          disabled={loading}
          type="submit"
          className="mt-5 py-2 px-6 bg-blue-500 rounded text-white "
        >
          {loading ? 'loading...' : 'Save'}
        </button>
      </p>
    </form>
  );
};

export default UpdateTaskForm;
