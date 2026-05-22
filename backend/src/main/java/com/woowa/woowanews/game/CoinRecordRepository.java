package com.woowa.woowanews.game;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoinRecordRepository extends JpaRepository<CoinRecord, Long> {
    List<CoinRecord> findTop10ByOrderByStreakDesc();
}
