const express = require("express");
const app = express();
(async () => {
  var neo4j = require("neo4j-driver");
  require("dotenv").config({
    path: "backend/db/Neo4j-2318c913-Created-2024-10-11.txt",
    debug: true,
  });

  const URI = process.env.NEO4J_URI;
  const USER = process.env.NEO4J_USERNAME;
  const PASSWORD = process.env.NEO4J_PASSWORD;
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    await driver.close();
    return;
  }
  let { records, summary } = await driver.executeQuery(
    'MATCH (p:Person) RETURN p.name AS name',
    {},
    { database: 'neo4j' }
  )
  
  // Loop through users and do process them
  for(let record of records) {
    console.log(`Person with name: ${record.get('name')}`)
    console.log(`Available properties for this node are: ${record.keys}\n`)
  }
  
  // Summary information
  console.log(
    `The query \`${summary.query.text}\` ` +
    `returned ${records.length} nodes.\n`
  )

  // Use the driver to run queries

  await driver.close();
})();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", async (request, response) => {
    
  response.send("Hello World");
});
