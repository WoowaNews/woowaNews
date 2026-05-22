package com.woowa.woowanews.footprint;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mission_footprint")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MissionFootprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String repoName;

    private int totalCommits;
    private int totalComments;
    private int participatingCrews;
    private int mergedPrCount;

    private String firstPrCrew;
    private LocalDateTime firstPrAt;

    private String fastestMergeCrew;
    private long fastestMergeMinutes;

    private String mostCommentsCrew;
    private int mostCommentsCount;

    private String mostCommitsCrew;
    private int mostCommitsCount;

    private LocalDateTime updatedAt;
}
