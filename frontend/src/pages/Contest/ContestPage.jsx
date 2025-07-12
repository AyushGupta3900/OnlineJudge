import { useParams, Link } from "react-router-dom";
import {
  useGetContestByIdQuery,
  useRegisterForContestMutation,
} from "../../redux/api/contestAPI";
import toast from "react-hot-toast";

const ContestPage = () => {
  const { id } = useParams();

  const { data, isLoading, error, refetch } = useGetContestByIdQuery(id);
  const [registerForContest, { isLoading: isRegistering }] =
    useRegisterForContestMutation();

  const dummyContest = {
    _id: id,
    title: "Dummy Contest Title",
    description: "This is a dummy contest for demonstration purposes.",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "running",
    problems: [
      {
        _id: "p1",
        title: "Two Sum",
        difficulty: "Easy",
      },
      {
        _id: "p2",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
      },
      {
        _id: "p3",
        title: "Word Ladder",
        difficulty: "Hard",
      },
    ],
  };

  const handleRegister = async () => {
    try {
      await registerForContest(id).unwrap();
      toast.success("Registered for contest!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading contest…</p>;
  }

  if (error) {
    toast.error("API error: showing dummy data.");
  }

  const contest = data?.contest || dummyContest;

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(contest.endTime);
    const diff = end - now;
    if (diff <= 0) return "Contest has ended";
    const mins = Math.floor(diff / 60000);
    return `${mins} minutes remaining`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{contest.title}</h1>
      <p className="text-gray-600 mb-4">{contest.description}</p>

      <div className="mb-4">
        <p>
          Start: {new Date(contest.startTime).toLocaleString()} | End:{" "}
          {new Date(contest.endTime).toLocaleString()}
        </p>
        <p>
          Status: <span className="font-semibold">{contest.status}</span>
        </p>
        {contest.status === "running" && (
          <p className="text-green-600">{getTimeRemaining()}</p>
        )}
        {contest.status === "upcoming" && (
          <p className="text-yellow-600">Contest hasn’t started yet</p>
        )}
      </div>

      {contest.status === "upcoming" && (
        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isRegistering ? "Registering…" : "Register for Contest"}
        </button>
      )}

      {contest.problems?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Problems</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {contest.problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/contest/${contest._id}/problem/${problem._id}`}
                className="p-4 border rounded hover:shadow"
              >
                <h3 className="font-bold">{problem.title}</h3>
                <p className="text-sm text-gray-600">{problem.difficulty}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;
