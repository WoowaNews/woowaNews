package com.woowa.woowanews.footprint;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FootprintResponse {
    private String repoName;
    private int totalCommits;
    private int totalComments;
    private int participatingCrews;
    private int mergedPrCount;
    private RankingInfo firstPR;
    private MergeInfo fastestMerge;
    private CountInfo mostComments;
    private CountInfo mostCommits;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankingInfo {
        private String crew;
        private String date;
        private String time;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MergeInfo {
        private String crew;
        private String duration;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountInfo {
        private String crew;
        private int count;
    }
}
