import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-gray-900 py-6 rounded-2xl">
        <h1 className="gradient-title font-extrabold text-3xl sm:text-5xl lg:text-7xl text-center pb-8 px-4">
          Post a Job
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0 text-white"
        >
          <Input placeholder="Job Title" {...register("title")} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

          <Textarea placeholder="Job Description" {...register("description")} />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1">
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-amber-50 max-h-80 overflow-y-auto">
                      <SelectGroup>
                        {State.getStatesOfCountry("IN").map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="flex-1">
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company">
                        {field.value
                          ? companies?.find((com) => com.id === Number(field.value))
                            ?.name
                          : "Company"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-amber-50">
                      <SelectGroup>
                        {companies?.map(({ name, id }) => (
                          <SelectItem key={name} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}

          <div className="w-full">
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <MDEditor 
                  value={field.value} 
                  onChange={field.onChange}
                  className="w-full"
                />
              )}
            />
          </div>
          
          {errors.requirements && (
            <p className="text-red-500">{errors.requirements.message}</p>
          )}
          {errors.errorCreateJob && (
            <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
          )}
          {errorCreateJob?.message && (
            <p className="text-red-500">{errorCreateJob?.message}</p>
          )}
          {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
          
          <Button type="submit" variant="blue" size="lg" className="mt-2 w-full sm:w-auto">
            Submit
          </Button>

          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </form>
      </div>
    </div>
  );
};

export default PostJob;