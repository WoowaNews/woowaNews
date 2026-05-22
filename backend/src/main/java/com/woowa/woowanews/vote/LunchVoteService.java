package com.woowa.woowanews.vote;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LunchVoteService {

    private final LunchVoteRepository lunchVoteRepository;

    public LunchVoteService(LunchVoteRepository lunchVoteRepository) {
        this.lunchVoteRepository = lunchVoteRepository;
    }

    @Transactional
    public LunchVoteResponse vote(String menuOption) {
        // Validate option
        if (!isValidOption(menuOption)) {
            throw new IllegalArgumentException("Invalid lunch menu option: " + menuOption);
        }

        LunchVote vote = new LunchVote();
        vote.setMenuOption(menuOption);
        vote.setVoteDate(LocalDate.now());
        vote.setVotedAt(LocalDateTime.now());
        lunchVoteRepository.save(vote);

        return getVoteResults();
    }

    @Transactional(readOnly = true)
    public LunchVoteResponse getVoteResults() {
        List<LunchVote> votes = lunchVoteRepository.findByVoteDate(LocalDate.now());

        Map<String, Integer> optionsCount = new HashMap<>();
        optionsCount.put("CORNER_C", 0);
        optionsCount.put("CORNER_D", 0);
        optionsCount.put("EAT_OUT", 0);
        optionsCount.put("LUNCH_BOX", 0);

        for (LunchVote vote : votes) {
            String option = vote.getMenuOption();
            if (optionsCount.containsKey(option)) {
                optionsCount.put(option, optionsCount.get(option) + 1);
            }
        }

        return new LunchVoteResponse(votes.size(), optionsCount);
    }

    private boolean isValidOption(String option) {
        return "CORNER_C".equals(option) || 
               "CORNER_D".equals(option) || 
               "EAT_OUT".equals(option) || 
               "LUNCH_BOX".equals(option);
    }
}
