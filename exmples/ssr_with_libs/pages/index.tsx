import moment from "moment";
import _ from "lodash";

interface User {
  id: number;
  name: string;
  dateOfBirth: string;
}

interface DB {
  storage: {
    users: User[];
  };
  users: {
    findMany: () => Promise<User[]>;
  };
}

const db: DB = {
  storage: {
    users: [
      { id: 1, name: "Nazarii", dateOfBirth: "09-01-1994" },
      { id: 2, name: "Sarah", dateOfBirth: "09-01-2005" },
      { id: 3, name: "John", dateOfBirth: "09-01-1917" },
    ],
  },
  users: {
    async findMany() {
      return Promise.resolve(db.storage.users);
    },
  },
};

const api = {
  fetchUsers(): Promise<User[]> {
    return db.users.findMany();
  },
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const result = await api.fetchUsers();

  // Pass data to the page via props
  return { props: { result } };
}

export default function MyComponent({ result }: { result: User[] }) {
  // Sort users by name
  const sorted = _.sortBy(result, "name");

  // Replace dateOfBirth property with age with a help of moment.js
  const users = sorted.map((u) => {
    const m = moment(u.dateOfBirth, "MM-DD-YYYY");
    return {
      id: u.id,
      name: u.name,
      age: moment().diff(m, "years", false),
    };
  });

  return (
    <main className="main">
      <h3>Hello from server-side rendered components</h3>
      <table>
        <thead>
          <tr>
            {Object.keys(users[0]).map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
