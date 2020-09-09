import React from 'react';
import Link from 'next/link';
import { TaskStatus } from '../generated/graphql';

const TaskFilter: React.FC = () => {
  return (
    <ul className="flex items-center justify-around mt-6">
      <li>
        <Link href="/">
          <a className="bg-blue-500 text-white px-6 py-2 rounded-full">All</a>
        </Link>
      </li>
      <li>
        <Link href="/[status]" as={`/${TaskStatus.Active}`}>
          <a className="bg-blue-500 text-white px-6 py-2 rounded-full">
            Active
          </a>
        </Link>
      </li>
      <li>
        <Link href="/[status]" as={`/${TaskStatus.Completed}`}>
          <a className="bg-blue-500 text-white px-6 py-2 rounded-full">
            Complete
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default TaskFilter;
