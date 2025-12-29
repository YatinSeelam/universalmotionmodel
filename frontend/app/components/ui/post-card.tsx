"use client";

import {
  FaRegPaperPlane,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";

export const PostCard: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  return (
   <div className="m-4 max-w-[30rem] w-full rounded-4xl bg-background border border-primary/10 shadow-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
            alt="Profile"
            width={35}
            height={35}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="flex flex-col">
              Universal Motion Model
              <span className="flex items-center gap-2 opacity-70 text-sm">
                <small>@UniversalMotion</small>
                <span>·</span>
                <small>7h</small>
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-6">
        <p className="whitespace-pre-wrap text-foreground">
          Universal Motion Model – Teaching robots how to move! ✨
          <br />
          <br />
          🚀 We&apos;re building the largest human-to-robot motion dataset to train AI models.
          <br />
          <br />
          🥳 Check out our interactive simulation!
        </p>
        <Image
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop"
          alt="Robot Technology"
          width={1920}
          height={1080}
          className="max-w-full rounded-lg object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/1920x1080/27272a/ffffff?text=Robot+Technology';
          }}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-evenly gap-2">
        <button
          onClick={handleLike}
          className="flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition hover:bg-secondary"
        >
          {liked ? <FaHeart color="red" /> : <FaRegHeart />}
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100 max-sm:hidden">
            {liked ? "Liked" : "Like"}
          </span>
        </button>
        <button
          onClick={handleBookmark}
          className="flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition hover:bg-secondary"
        >
          {bookmarked ? <FaBookmark color="#00bfff" /> : <FaRegBookmark />}
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100 max-sm:hidden">
            {bookmarked ? "Saved" : "Save"}
          </span>
        </button>
        <button className="flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition hover:bg-secondary">
          <FaRegPaperPlane />
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100 max-sm:hidden">
            Share
          </span>
        </button>
      </div>
    </div>
  )
}



