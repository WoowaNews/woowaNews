package com.woowa.woowanews.game;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReactionRecordRepository extends JpaRepository<ReactionRecord, Long> {
    List<ReactionRecord> findTop10ByOrderByAvgMsAsc();
}
