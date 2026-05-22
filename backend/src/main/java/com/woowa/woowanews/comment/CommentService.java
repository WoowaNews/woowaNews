package com.woowa.woowanews.comment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Transactional
    public CommentResponse create(String content) {
        Comment comment = commentRepository.save(new Comment(content));
        return CommentResponse.from(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> findAll() {
        return commentRepository.findAllByOrderByCreateAtDesc()
                .stream()
                .map(CommentResponse::from)
                .toList();
    }
}
