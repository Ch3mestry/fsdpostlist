"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Comment, CreateCommentDto } from "@/entities/comment/model/types";
import { CommentList } from "@/entities/comment/ui/comment-list";
import { commentApi } from "@/entities/comment/api/comment-api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";

const commentSchema = z.object({
  body: z
    .string()
    .min(1, "Комментарий не может быть пустым")
    .transform((val) => val.trim())
    .refine((val) => val.length >= 10, {
      message: "Комментарий должен содержать минимум 10 символов",
    }),
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Некорректный email"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

const { data: comments, isLoading, error } = useQuery({
  queryKey: ["comments", postId],
  queryFn: () => commentApi.getCommentsByPostId(postId),
});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "Guest User",
      email: "guest@example.com",
      body: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: CommentFormData) => {
      const commentDto: CreateCommentDto = {
        postId,
        ...data,
      };
      return commentApi.createComment(commentDto);
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments",
        postId,
      ]);

      const optimisticComment: Comment = {
        id: Date.now(), // Временный ID
        postId,
        name: newComment.name,
        email: newComment.email,
        body: newComment.body,
      };

      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comments", postId], context?.previousComments);
      toast.error("Ошибка при добавлении комментария");
    },
    onSuccess: () => {
      toast.success("Комментарий добавлен");
      reset();
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const onSubmit = (data: CommentFormData) => {
    createCommentMutation.mutate(data);
  };

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-start"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Комментарии ({comments?.length || 0})
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Форма добавления комментария */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Textarea
              {...register("body")}
              placeholder="Напишите комментарий (минимум 10 символов)..."
              className="resize-none"
              rows={3}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                "Отправить комментарий"
              )}
            </Button>
          </form>

          {/* Список комментариев */}
          {isLoading && (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          )}

          {error && (
            <div className="text-center text-destructive py-4">
              Ошибка загрузки комментариев
            </div>
          )}

          {comments && <CommentList comments={comments} isLoading={isLoading} />}
        </div>
      )}
    </div>
  );
}
