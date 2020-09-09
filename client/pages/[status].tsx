import Head from 'next/head';
import { NextPage } from 'next';
import { withApollo } from '../lib/apollo';
import { useTasksQuery, TaskStatus } from '../generated/graphql';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import { useRouter } from 'next/router';
import TaskFilter from '../components/TaskFilter';
import { createContext } from 'react';

interface initialProps {
  ssr: boolean;
}
interface Props extends initialProps {}

interface TaskFilterContextValue {
  status?: TaskStatus;
}
export const TaskFilterContext = createContext<TaskFilterContextValue>({});
const Home: NextPage<Props, initialProps> = ({ ssr }) => {
  const router = useRouter();
  const status =
    typeof router.query.status === 'string'
      ? (router.query.status as TaskStatus)
      : undefined;

  const { loading, error, data, refetch } = useTasksQuery({
    variables: { status },
    fetchPolicy: ssr ? 'cache-first' : 'cache-and-network',
  });
  const tasks = data?.tasks;

  if (loading && !tasks) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>An error occurred.</p>;
  }
  const taskFilter = { status };
  return (
    <TaskFilterContext.Provider value={taskFilter}>
      <Head>
        <title>NexTask</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CreateTaskForm onTaskCreated={refetch} />
      {tasks && tasks.length ? (
        <TaskList tasks={tasks} />
      ) : (
        <p className="mt-6">There are no tasks here.</p>
      )}
      <TaskFilter />
    </TaskFilterContext.Provider>
  );
};

Home.getInitialProps = async (ctx) => {
  return {
    ssr: !!ctx.req,
  };
};

const HomePageWithApollo = withApollo(Home);

export default HomePageWithApollo;
