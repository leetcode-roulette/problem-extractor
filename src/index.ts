import { app } from "./app";
import { Database } from "./db/db.config";
import { PopulateProblems } from "./db/problems";

const serve = async () : Promise<void> => {
  const PORT : string | number = process.env.PORT || 3000;

  try {
    await Database.connect();
    await PopulateProblems.populate();
  } catch(e) {
    console.log("Exception caught populating database: " + e);
  }

  app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
  });
}

serve();