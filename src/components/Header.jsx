import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.png" className="h-12 sm:h-16 md:h-20" alt="Hirrd Logo" />
        </Link>

        <div className="flex gap-2 sm:gap-4 md:gap-8 items-center">
          <SignedOut>
            <Button 
              variant="outline" 
              onClick={() => setShowSignIn(true)}
              className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job" className="hidden xs:block">
                <Button variant="destructive" className="rounded-full text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                  <PenBox size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Post a Job</span>
                  <span className="sm:hidden">Post</span>
                </Button>
              </Link>
            )}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job" className="xs:hidden">
                <Button variant="destructive" className="rounded-full p-2">
                  <PenBox size={16} />
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-md">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;