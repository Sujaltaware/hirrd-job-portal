import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { City, State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "../hooks/use-fetch";
import "./job-listing.css";
import JobCard from "../components/job-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "../api/apiCompanies";
import { getJobs } from "../api/apiJobs";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="gradient-title font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center pb-6 sm:pb-8">
        Latest Jobs
      </h1>
      
      <form
        onSubmit={handleSearch}
        className="h-12 sm:h-14 flex flex-col sm:flex-row w-full gap-2 sm:gap-2 items-stretch sm:items-center mb-4 sm:mb-3 text-amber"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1 px-3 sm:px-4 text-sm sm:text-md bg-gray-300"
        />
        <Button type="submit" className="h-full w-full sm:w-20 md:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex-1">
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className="bg-gray-300 w-full mt-4">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent className="bg-gray-300 max-h-60 sm:max-h-80 overflow-y-auto">
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => {
                  return (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="bg-gray-300 w-full mt-4">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent className="bg-gray-300">
              <SelectGroup>
                {companies?.map(({ name, id }) => {
                  return (
                    <SelectItem key={name} value={id}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 sm:flex-none">
          <Button
            className="w-full sm:w-32 md:w-40 mt-4"
            variant="destructive"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="text-white col-span-full text-center py-8 text-lg">
              No Jobs Found 😢
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;