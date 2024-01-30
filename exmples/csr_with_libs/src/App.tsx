import { useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";

interface User {
  id: number;
  name: string;
  age: number;
}

interface DBUser {
  id: number;
  name: string;
  dateOfBirth: string;
}

interface DB {
  storage: {
    users: DBUser[];
  };
  users: {
    findMany: () => Promise<DBUser[]>;
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
  fetchUsers(): Promise<DBUser[]> {
    return db.users.findMany();
  },
};

export default function MyComponent() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch data from api
      const result = await api.fetchUsers();

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

      // Set user object to state
      setUsers(users);
    };
    fetchUsers();
  }, []);

  return (
    <main className="main">
      <h3>Hello from client-side rendered components (interactive)</h3>
      {users.length > 0 && (
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
      )}
    </main>
  );
}
