import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import "./job.css";
import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "../api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8 mt-5 bg-gray-900 w-full p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 lg:top-6 lg:right-6 
                     p-2 sm:p-2.5 md:p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white 
                     transition-colors duration-200 z-10 touch-manipulation"
          aria-label="Go back"
        >
          <X size={16} className="sm:hidden" />
          <X size={18} className="hidden sm:block md:hidden" />
          <X size={20} className="hidden md:block" />
        </button>

        <div className="flex flex-col-reverse gap-4 sm:gap-6 md:flex-row justify-between items-center pr-12 sm:pr-14 md:pr-16">
          <h1 className="gradient-title font-extrabold pb-3 text-2xl sm:text-4xl lg:text-6xl text-white text-center md:text-left">
            {job?.title}
          </h1>
          <img 
            src={job?.company?.logo} 
            className="h-10 sm:h-12 md:h-14 lg:h-16 flex-shrink-0" 
            alt={job?.title} 
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 flex-wrap">
          <div className="flex gap-2 text-white items-center min-w-0">
            <MapPinIcon size={16} className="flex-shrink-0 sm:w-4 sm:h-4 md:w-5 md:h-5" /> 
            <span className="text-sm sm:text-base md:text-lg truncate">{job?.location}</span>
          </div>
          <div className="flex gap-2 text-white items-center min-w-0">
            <Briefcase size={16} className="flex-shrink-0 sm:w-4 sm:h-4 md:w-5 md:h-5" /> 
            <span className="text-sm sm:text-base md:text-lg whitespace-nowrap">
              {job?.applications?.length} Applicants
            </span>
          </div>
          <div className="flex gap-2 text-white items-center min-w-0">
            {job?.isOpen ? (
              <>
                <DoorOpen size={16} className="flex-shrink-0 sm:w-4 sm:h-4 md:w-5 md:h-5" /> 
                <span className="text-sm sm:text-base md:text-lg">Open</span>
              </>
            ) : (
              <>
                <DoorClosed size={16} className="flex-shrink-0 sm:w-4 sm:h-4 md:w-5 md:h-5" /> 
                <span className="text-sm sm:text-base md:text-lg">Closed</span>
              </>
            )}
          </div>
        </div>

        {job?.recruiter_id === user?.id && (
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base ${
                job?.isOpen ? "bg-green-700 font-semibold" : "bg-red-700 font-semibold"
              }`}
            >
              <SelectValue
                placeholder={
                  "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                }
              />
            </SelectTrigger>
            <SelectContent className="text-black bg-white">
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )}

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          About the job
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed">
          {job?.description}
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          What we are looking for
        </h2>
        <div className="w-full overflow-x-auto">
          <MDEditor.Markdown
            source={job?.requirements}
            className="markdown-content !bg-transparent text-sm sm:text-base md:text-lg"
          />
        </div>

        {job?.recruiter_id !== user?.id && (
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
          />
        )}

        {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

        {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold mb-4 text-lg sm:text-xl md:text-2xl ml-1 text-white">
              Applications
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {job?.applications.map((application) => {
                return (
                  <ApplicationCard key={application.id} application={application} />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;