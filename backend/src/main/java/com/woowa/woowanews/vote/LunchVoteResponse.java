package com.woowa.woowanews.vote;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LunchVoteResponse {
    private int totalVotes;
    private Map<String, Integer> options;
}
