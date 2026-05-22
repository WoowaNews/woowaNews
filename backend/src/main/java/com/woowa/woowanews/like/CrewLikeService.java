package com.woowa.woowanews.like;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CrewLikeService {

    private final CrewLikeRepository crewLikeRepository;

    public CrewLikeService(CrewLikeRepository crewLikeRepository) {
        this.crewLikeRepository = crewLikeRepository;
    }

    @Transactional
    public CrewLike like(String crewName) {
        return crewLikeRepository.findById(crewName)
                .map(existing -> {
                    existing.setLikeCount(existing.getLikeCount() + 1);
                    return crewLikeRepository.save(existing);
                })
                .orElseGet(() -> {
                    CrewLike newLike = new CrewLike(crewName, 1);
                    return crewLikeRepository.save(newLike);
                });
    }

    @Transactional(readOnly = true)
    public CrewLike getLikes(String crewName) {
        return crewLikeRepository.findById(crewName)
                .orElse(new CrewLike(crewName, 0));
    }
}
