import { ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { User } from 'lucide-react';
import React from 'react';
import Loader from '../loader';
import { Button } from '@/components/ui/button';

const ClerkAuthState = () => {
  return (
    <>
      <ClerkLoading>
        <Loader state>
          <></>
        </Loader>
      </ClerkLoading>
      <SignedOut>
        <SignInButton>
          <Button className="rounded-xl bg-[#252525] text-white hover:bg-[#252525]">
            <User />
            Login
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: { userButtonPopoverCard: { pointerEvents: 'initial' } },
          }}
        >
          <UserButton.UserProfileLink label="Dashboard" url="/dashboard" labelIcon={<User size={16} />}></UserButton.UserProfileLink>
        </UserButton>
      </SignedIn>
    </>
  );
};

export default ClerkAuthState;
