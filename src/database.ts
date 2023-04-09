import { Client } from "pg";

const client: Client = new Client({
  user: "Windows",
  host: "localhost",
  port: 5432,
  password: "12345",
  database: "s2_entrega",
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected");
};

export { client, startDatabase };
