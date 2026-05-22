package com.woowa.woowanews.comment;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        @JsonProperty("create_at")
        LocalDateTime createAt
) {

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreateAt()
        );
    }
}
