import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="gradient-title font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center pb-4 sm:pb-6 md:pb-8 px-2">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-4 sm:mt-6 md:mt-8">
          {savedJobs?.length ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {savedJobs?.map((saved) => {
                return (
                  <JobCard
                    key={saved.id}
                    job={saved?.job}
                    onJobAction={fnSavedJobs}
                    savedInit={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-white text-center py-8 text-base sm:text-lg">
              No Saved Jobs 👀
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;