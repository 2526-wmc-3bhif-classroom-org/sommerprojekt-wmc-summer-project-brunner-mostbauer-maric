import { Unit } from "../unit.js";

/**
 * Background task to geocode driving schools lacking coordinates on startup.
 */
export async function geocodeSchoolsBackground() {
  setTimeout(async () => {
    console.log("Starting background geocoding check...");
    let schools: { DrivingSchoolId: number; Location: string }[] = [];

    // 1. Fetch schools missing coordinates
    const readUnit = Unit.createReadonly();
    try {
      schools = readUnit.prepare<{ DrivingSchoolId: number; Location: string }>(
        "SELECT DrivingSchoolId, Location FROM DrivingSchool WHERE Location IS NOT NULL AND Location != '' AND (Latitude IS NULL OR Longitude IS NULL)"
      ).all();
    } catch (err) {
      console.error("Failed to query schools for geocoding:", err);
    } finally {
      readUnit.complete();
    }

    if (schools.length === 0) {
      console.log("All schools are already geocoded.");
      return;
    }

    console.log(`Found ${schools.length} schools lacking coordinates. Geocoding in background...`);

    // 2. Geocode each school and update the database
    for (const school of schools) {
      try {
        console.log(`Geocoding school ID ${school.DrivingSchoolId}: "${school.Location}"`);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(school.Location)}&format=json&limit=1`;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "DrivingSchoolApp/1.0 (contact: admin@admin.com)"
          }
        });

        if (response.ok) {
          const data = (await response.json()) as any[];
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // Open a brief write transaction for this update
            const writeUnit = new Unit(false);
            let updateSuccess = false;
            try {
              writeUnit
                .prepare(
                  "UPDATE DrivingSchool SET Latitude = ?, Longitude = ? WHERE DrivingSchoolId = ?"
                )
                .run(lat, lon, school.DrivingSchoolId);
              updateSuccess = true;
              console.log(`Successfully geocoded school ID ${school.DrivingSchoolId} to: Lat=${lat}, Lon=${lon}`);
            } finally {
              writeUnit.complete(updateSuccess);
            }
          } else {
            console.log(`No coordinates resolved for school ID ${school.DrivingSchoolId}: "${school.Location}"`);
          }
        } else {
          console.log(`Nominatim API response error: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error(`Failed to geocode school ID ${school.DrivingSchoolId} ("${school.Location}"):`, err);
      }

      // Wait 1 second to respect Nominatim API terms of service
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("Background geocoding check complete.");
  }, 5000);
}
