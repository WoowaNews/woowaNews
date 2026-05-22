package com.woowa.woowanews.footprint;

import com.woowa.woowanews.github.GithubClient;
import com.woowa.woowanews.github.CrewMapService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FootprintService {

    private final MissionFootprintRepository footprintRepository;
    private final GithubClient githubClient;
    private final CrewMapService crewMapService;

    @Value("${github.cohort-start-date:2026-02-20T00:00:00Z}")
    private String cohortStartDate;

    private static final List<String> REPOSITORIES = Arrays.asList(
            "java-janggi",
            "javascript-movie-review",
            "android-shopping-cart"
    );

    public FootprintService(MissionFootprintRepository footprintRepository,
                            GithubClient githubClient,
                            CrewMapService crewMapService) {
        this.footprintRepository = footprintRepository;
        this.githubClient = githubClient;
        this.crewMapService = crewMapService;
    }

    @Transactional
    public List<FootprintResponse> getFootprints() {
        List<FootprintResponse> responses = new ArrayList<>();
        for (String repo : REPOSITORIES) {
            Optional<MissionFootprint> cached = footprintRepository.findByRepoName(repo);
            if (cached.isPresent() && cached.get().getUpdatedAt().toLocalDate().equals(LocalDate.now())) {
                responses.add(toResponse(cached.get()));
            } else {
                // If outdated or missing, sync and save
                MissionFootprint footprint = syncRepository(repo, cached.orElse(null));
                responses.add(toResponse(footprint));
            }
        }
        return responses;
    }

    @Transactional
    public void syncAll() {
        for (String repo : REPOSITORIES) {
            Optional<MissionFootprint> cached = footprintRepository.findByRepoName(repo);
            syncRepository(repo, cached.orElse(null));
        }
    }

    private MissionFootprint syncRepository(String repo, MissionFootprint existing) {
        try {
            List<GithubClient.GithubPull> pulls = githubClient.fetchPulls(repo, cohortStartDate);
            List<GithubClient.GithubComment> issueComments = githubClient.fetchIssueComments(repo, cohortStartDate);
            List<GithubClient.GithubComment> reviewComments = githubClient.fetchReviewComments(repo, cohortStartDate);

            // If we failed to fetch pulls or comments (e.g. rate limit, invalid token),
            // and we have an existing cache, keep using it (just touch updatedAt or keep it).
            if (pulls.isEmpty() && existing != null) {
                existing.setUpdatedAt(LocalDateTime.now());
                return footprintRepository.save(existing);
            }

            MissionFootprint footprint = existing != null ? existing : new MissionFootprint();
            footprint.setRepoName(repo);
            footprint.setUpdatedAt(LocalDateTime.now());

            // 1. Filter PRs
            List<GithubClient.GithubPull> mergedPulls = new ArrayList<>();
            Set<String> participatingGithubUsers = new HashSet<>();
            int totalCommits = 0;

            GithubClient.GithubPull firstPr = null;
            LocalDateTime firstPrAt = null;

            GithubClient.GithubPull fastestPr = null;
            long fastestMergeMinutes = Long.MAX_VALUE;

            Map<String, Integer> commitCounts = new HashMap<>();

            for (GithubClient.GithubPull pull : pulls) {
                if (pull.user != null) {
                    participatingGithubUsers.add(pull.user.login);
                }

                LocalDateTime createdAt = toSeoulLocalDateTime(pull.createdAt);
                if (firstPrAt == null || (createdAt != null && createdAt.isBefore(firstPrAt))) {
                    firstPrAt = createdAt;
                    firstPr = pull;
                }

                if (pull.mergedAt != null) {
                    mergedPulls.add(pull);

                    LocalDateTime mergedAt = toSeoulLocalDateTime(pull.mergedAt);
                    if (createdAt != null && mergedAt != null) {
                        long diff = Duration.between(createdAt, mergedAt).toMinutes();
                        if (diff < fastestMergeMinutes) {
                            fastestMergeMinutes = diff;
                            fastestPr = pull;
                        }
                    }

                    // Fetch detail for commits
                    GithubClient.GithubPullDetail detail = githubClient.fetchPullDetail(repo, pull.number);
                    totalCommits += detail.commits;

                    if (pull.user != null) {
                        String crewName = crewMapService.getCrewName(pull.user.login);
                        commitCounts.put(crewName, commitCounts.getOrDefault(crewName, 0) + detail.commits);
                    }
                }
            }

            footprint.setMergedPrCount(mergedPulls.size());
            footprint.setParticipatingCrews(participatingGithubUsers.size());
            footprint.setTotalCommits(totalCommits);

            // First PR Creator
            if (firstPr != null && firstPr.user != null) {
                footprint.setFirstPrCrew(crewMapService.getCrewName(firstPr.user.login));
                footprint.setFirstPrAt(firstPrAt);
            } else {
                footprint.setFirstPrCrew("N/A");
                footprint.setFirstPrAt(null);
            }

            // Fastest Merge
            if (fastestPr != null && fastestPr.user != null) {
                footprint.setFastestMergeCrew(crewMapService.getCrewName(fastestPr.user.login));
                footprint.setFastestMergeMinutes(fastestMergeMinutes);
            } else {
                footprint.setFastestMergeCrew("N/A");
                footprint.setFastestMergeMinutes(0);
            }

            // Most Commits Crew
            String mostCommitsCrew = "N/A";
            int mostCommitsCount = 0;
            for (Map.Entry<String, Integer> entry : commitCounts.entrySet()) {
                if (entry.getValue() > mostCommitsCount) {
                    mostCommitsCount = entry.getValue();
                    mostCommitsCrew = entry.getKey();
                }
            }
            footprint.setMostCommitsCrew(mostCommitsCrew);
            footprint.setMostCommitsCount(mostCommitsCount);

            // Comments Aggregation
            List<GithubClient.GithubComment> allComments = new ArrayList<>();
            allComments.addAll(issueComments);
            allComments.addAll(reviewComments);
            footprint.setTotalComments(allComments.size());

            Map<String, Integer> commentCounts = new HashMap<>();
            for (GithubClient.GithubComment comment : allComments) {
                if (comment.user != null) {
                    String crewName = crewMapService.getCrewName(comment.user.login);
                    commentCounts.put(crewName, commentCounts.getOrDefault(crewName, 0) + 1);
                }
            }

            String mostCommentsCrew = "N/A";
            int mostCommentsCount = 0;
            for (Map.Entry<String, Integer> entry : commentCounts.entrySet()) {
                if (entry.getValue() > mostCommentsCount) {
                    mostCommentsCount = entry.getValue();
                    mostCommentsCrew = entry.getKey();
                }
            }
            footprint.setMostCommentsCrew(mostCommentsCrew);
            footprint.setMostCommentsCount(mostCommentsCount);

            return footprintRepository.save(footprint);
        } catch (Exception e) {
            System.err.println("Failed to sync footprint for " + repo + ": " + e.getMessage());
            e.printStackTrace();
            if (existing != null) {
                return existing;
            }
            // Return empty fallback if completely new and failed
            MissionFootprint fallback = new MissionFootprint();
            fallback.setRepoName(repo);
            fallback.setFirstPrCrew("N/A");
            fallback.setFastestMergeCrew("N/A");
            fallback.setMostCommentsCrew("N/A");
            fallback.setMostCommitsCrew("N/A");
            fallback.setUpdatedAt(LocalDateTime.now());
            return footprintRepository.save(fallback);
        }
    }

    private FootprintResponse toResponse(MissionFootprint entity) {
        FootprintResponse res = new FootprintResponse();
        res.setRepoName(entity.getRepoName());
        res.setTotalCommits(entity.getTotalCommits());
        res.setTotalComments(entity.getTotalComments());
        res.setParticipatingCrews(entity.getParticipatingCrews());
        res.setMergedPrCount(entity.getMergedPrCount());

        // First PR
        if (entity.getFirstPrAt() != null) {
            String dateStr = entity.getFirstPrAt().format(DateTimeFormatter.ofPattern("M월 d일"));
            String timeStr = entity.getFirstPrAt().format(DateTimeFormatter.ofPattern("a h:mm", Locale.KOREAN));
            res.setFirstPR(new FootprintResponse.RankingInfo(entity.getFirstPrCrew(), dateStr, timeStr));
        } else {
            res.setFirstPR(new FootprintResponse.RankingInfo("N/A", "", ""));
        }

        // Fastest Merge
        if (entity.getFastestMergeMinutes() > 0 && !entity.getFastestMergeCrew().equals("N/A")) {
            long minutes = entity.getFastestMergeMinutes();
            String durationStr;
            if (minutes >= 60) {
                durationStr = (minutes / 60) + "시간 " + (minutes % 60) + "분";
            } else {
                durationStr = minutes + "분";
            }
            res.setFastestMerge(new FootprintResponse.MergeInfo(entity.getFastestMergeCrew(), durationStr));
        } else {
            res.setFastestMerge(new FootprintResponse.MergeInfo("N/A", "N/A"));
        }

        // Most Comments
        res.setMostComments(new FootprintResponse.CountInfo(entity.getMostCommentsCrew(), entity.getMostCommentsCount()));

        // Most Commits
        res.setMostCommits(new FootprintResponse.CountInfo(entity.getMostCommitsCrew(), entity.getMostCommitsCount()));

        return res;
    }

    private LocalDateTime toSeoulLocalDateTime(String isoStr) {
        if (isoStr == null) return null;
        try {
            return ZonedDateTime.parse(isoStr).withZoneSameInstant(ZoneId.of("Asia/Seoul")).toLocalDateTime();
        } catch (Exception e) {
            return null;
        }
    }
}
