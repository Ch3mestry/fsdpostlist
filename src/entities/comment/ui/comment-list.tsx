"use client";

import { Comment } from "../model/types";
import { Card, CardContent } from "@/components/ui/card";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

const CommentSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Loading...</h4>
            <p className="text-xs text-muted-foreground mb-2">Loading...</p>
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Нет комментариев
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card key={comment.id} className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{comment.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {comment.email}
                </p>
                <p className="text-sm">{comment.body}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
