"use client";

import { useState } from "react";
import { User } from "../model/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";

interface UserAvatarProps {
  userId: number;
}

export function UserAvatar({ userId }: UserAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getUser(userId),
    enabled: isHovered, // Запрос только при наведении
    staleTime: 5 * 60 * 1000, // 5 минут кэша
  });

  const generateAvatarSvg = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="#3B82F6"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${initials}</text>
      </svg>
    `;
  };

  const renderAvatar = () => {
    if (isLoading) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    if (error || !user) {
      return (
        <div
          className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold"
          dangerouslySetInnerHTML={{
            __html: generateAvatarSvg(`User ${userId}`),
          }}
        />
      );
    }

    return (
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center"
        dangerouslySetInnerHTML={{
          __html: generateAvatarSvg(user.name),
        }}
      />
    );
  };

  const renderTooltipContent = () => {
    if (isLoading) {
      return <div className="text-sm">Загрузка...</div>;
    }

    if (error || !user) {
      return <div className="text-sm">Не удалось загрузить пользователя</div>;
    }

    return (
      <div className="space-y-2">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-muted-foreground">@{user.username}</div>
        <div className="text-sm">{user.email}</div>
        <div className="text-xs text-muted-foreground">{user.company.name}</div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-pointer"
          >
            {renderAvatar()}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          {renderTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
