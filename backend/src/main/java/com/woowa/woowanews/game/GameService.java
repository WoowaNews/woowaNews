package com.woowa.woowanews.game;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GameService {

    private final ReactionRecordRepository reactionRepo;
    private final CoinRecordRepository coinRepo;

    public GameService(ReactionRecordRepository reactionRepo, CoinRecordRepository coinRepo) {
        this.reactionRepo = reactionRepo;
        this.coinRepo = coinRepo;
    }

    public List<ReactionRecord> getReactionRanking() {
        return reactionRepo.findTop10ByOrderByAvgMsAsc();
    }

    public ReactionRecord saveReactionRecord(String name, int avgMs) {
        ReactionRecord record = new ReactionRecord();
        record.setName(name);
        record.setAvgMs(avgMs);
        record.setRecordedDate(LocalDate.now());
        return reactionRepo.save(record);
    }

    public List<CoinRecord> getCoinRanking() {
        return coinRepo.findTop10ByOrderByStreakDesc();
    }

    public CoinRecord saveCoinRecord(String name, int streak) {
        CoinRecord record = new CoinRecord();
        record.setName(name);
        record.setStreak(streak);
        record.setRecordedDate(LocalDate.now());
        return coinRepo.save(record);
    }
}
