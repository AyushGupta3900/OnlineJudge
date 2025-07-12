import { useGetAllContestsQuery } from "../../redux/api/contestAPI";
import { Link } from "react-router-dom";

const Contests = () => {
  const { data, isLoading, error } = useGetAllContestsQuery();

  if (isLoading) {
    return <p className="text-center text-lg">Loading contests…</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        Failed to load contests: {error?.data?.message || error.error}
      </p>
    );
  }

  const contestsData = data?.contests || {};

  const upcoming = contestsData.upcoming || [];
  const active = contestsData.active || [];
  const past = contestsData.past || [];

  const Section = ({ title, contests = [] }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {contests.length === 0 ? (
        <p className="text-gray-500">No contests in this category.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {contests.map((contest) => (
            <Link
              key={contest._id}
              to={`/contest/${contest._id}`}
              className="p-4 border rounded hover:shadow transition"
            >
              <h3 className="font-bold text-lg">{contest.title}</h3>
              <p className="text-sm text-gray-600">{contest.description}</p>
              <p className="text-sm mt-2">
                {new Date(contest.startTime).toLocaleString()} →{" "}
                {new Date(contest.endTime).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Contests</h1>

      <Section title="Running Contests" contests={active} />
      <Section title="Upcoming Contests" contests={upcoming} />
      <Section title="Past Contests" contests={past} />
    </div>
  );
};

export default Contests;
