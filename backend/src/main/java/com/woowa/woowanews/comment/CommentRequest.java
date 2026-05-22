package com.woowa.woowanews.comment;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(
        @NotBlank(message = "content는 비어 있을 수 없습니다.")
        String content
) {
}
