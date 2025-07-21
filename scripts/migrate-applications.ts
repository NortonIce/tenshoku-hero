import connectDB from "@/db/mongodb";
import Application from "@/db/models/Application";

/**
 * Migration script to convert existing applications from the old structure 
 * (status + applicationDate) to the new structure (steps array)
 */
async function migrateApplications() {
  try {
    await connectDB();
    
    // Find all applications that still have the old structure
    const applications = await Application.find({
      $or: [
        { status: { $exists: true } },
        { applicationDate: { $exists: true } }
      ]
    });

    console.log(`Found ${applications.length} applications to migrate`);

    for (const app of applications) {
      // Skip if already migrated (has steps array)
      if (app.steps && Array.isArray(app.steps) && app.steps.length > 0) {
        console.log(`Skipping ${app.company} - already migrated`);
        continue;
      }

      // Create the initial step based on old status and date
      const initialStep = {
        type: app.status === "Take home assignment" ? "Take Home Assignment" : app.status,
        date: app.applicationDate || app.createdAt,
        notes: ""
      };

      // Update the application with the new structure
      await Application.findByIdAndUpdate(app._id, {
        steps: [initialStep],
        $unset: {
          status: "",
          applicationDate: ""
        }
      });

      console.log(`Migrated ${app.company} - ${app.position}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run the migration
if (require.main === module) {
  migrateApplications()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default migrateApplications;