"use client";

import { MoveRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const Hero = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-bold">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Visualize{" "}
              </span>
              Your Musics
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Generate insights about your top artists, tracks, and genres.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              View Demo
            </Button>
            {session ? (
              <Button size="lg" className="gap-4" asChild>
                <Link href="/dashboard">
                  View Dashboard <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="gap-4" asChild>
                <Link href="/auth/signin">
                  Sign in
                  <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
