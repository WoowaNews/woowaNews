package com.woowa.woowanews.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewLikeRepository extends JpaRepository<CrewLike, String> {
}
