package com.woowa.woowanews.vote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LunchVoteRepository extends JpaRepository<LunchVote, Long> {
    List<LunchVote> findByVoteDate(LocalDate voteDate);
}
