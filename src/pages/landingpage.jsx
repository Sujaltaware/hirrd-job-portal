import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 py-6 sm:py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <section className="text-center space-y-4 sm:space-y-6 md:space-y-8">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl tracking-tighter leading-tight">
          <span className="mb-2 sm:mb-4">Find Your Dream Job</span>
          <span className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-wrap justify-center">
            and get
            <img
              src="/logo.png"
              className="h-10 sm:h-14 md:h-20 lg:h-24 xl:h-32 object-contain"
              alt="Hirrd Logo"
            />
          </span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto px-4">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
        <Link to={"/jobs"} className="w-full sm:w-auto">
          <Button variant="blue" size="xl" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3">
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-job"} className="w-full sm:w-auto">
          <Button variant="destructive" size="xl" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3">
            Post a Job
          </Button>
        </Link>
      </div>
      <div className="w-full overflow-hidden">
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full py-6 sm:py-8 md:py-10"
        >
          <CarouselContent className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-20 items-center -ml-4">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4 flex justify-center">
                <img
                  src={path}
                  alt={name}
                  className="h-8 sm:h-10 md:h-12 lg:h-14 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="w-full relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl">
        <img 
          src="/banner.jpeg" 
          alt="Job Portal Banner"
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <Card className="text-white bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl text-blue-400">
              For Job Seekers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base leading-relaxed">
            Search and apply for jobs, track applications, and more. Find your perfect career opportunity with our advanced search filters and personalized recommendations.
          </CardContent>
        </Card>
        
        <Card className="text-white bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl text-red-400">
              For Employers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base leading-relaxed">
            Post jobs, manage applications, and find the best candidates. Streamline your hiring process with our comprehensive recruitment tools.
          </CardContent>
        </Card>
      </section>
      <section className="w-full space-y-4 sm:space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="multiple" className="w-full text-white space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index + 1}`}
              className="border-gray-700 bg-gray-900/50 rounded-lg px-4 sm:px-6"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base md:text-lg font-medium hover:text-blue-400 transition-colors duration-200 py-4 sm:py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-gray-300 leading-relaxed pb-4 sm:pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;