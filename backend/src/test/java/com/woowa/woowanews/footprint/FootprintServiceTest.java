package com.woowa.woowanews.footprint;

import com.woowa.woowanews.github.GithubClient;
import com.woowa.woowanews.github.CrewMapService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class FootprintServiceTest {

    private MissionFootprintRepository footprintRepository;
    private GithubClient githubClient;
    private CrewMapService crewMapService;
    private FootprintService footprintService;

    @BeforeEach
    void setUp() {
        footprintRepository = mock(MissionFootprintRepository.class);
        githubClient = mock(GithubClient.class);
        crewMapService = mock(CrewMapService.class);
        footprintService = new FootprintService(footprintRepository, githubClient, crewMapService);
    }

    @Test
    void shouldReturnCachedFootprintIfUpdatedToday() {
        // Given
        when(footprintRepository.findByRepoName(anyString())).thenAnswer(invocation -> {
            String repo = invocation.getArgument(0);
            MissionFootprint cached = new MissionFootprint();
            cached.setRepoName(repo);
            cached.setTotalCommits(10);
            cached.setTotalComments(5);
            cached.setParticipatingCrews(3);
            cached.setMergedPrCount(2);
            cached.setFirstPrCrew("무빙");
            cached.setFirstPrAt(LocalDateTime.now());
            cached.setFastestMergeCrew("무빙");
            cached.setFastestMergeMinutes(120);
            cached.setMostCommentsCrew("아티");
            cached.setMostCommentsCount(3);
            cached.setMostCommitsCrew("요크");
            cached.setMostCommitsCount(8);
            cached.setUpdatedAt(LocalDateTime.now()); // Updated today
            return Optional.of(cached);
        });

        // When
        List<FootprintResponse> responses = footprintService.getFootprints();

        // Then
        // Verify githubClient was never called because data was cached and updated today
        verifyNoInteractions(githubClient);

        // Verify result matches cache for one of the repos
        FootprintResponse response = responses.stream()
                .filter(r -> r.getRepoName().equals("java-janggi"))
                .findFirst()
                .orElseThrow();
        assertThat(response.getTotalCommits()).isEqualTo(10);
        assertThat(response.getTotalComments()).isEqualTo(5);
        assertThat(response.getFirstPR().getCrew()).isEqualTo("무빙");
    }

    @Test
    void shouldFetchAndSyncIfNoCacheFound() {
        // Given
        when(footprintRepository.findByRepoName(anyString())).thenReturn(Optional.empty());
        when(githubClient.fetchPulls(anyString(), any())).thenReturn(Collections.emptyList());
        when(githubClient.fetchIssueComments(anyString(), any())).thenReturn(Collections.emptyList());
        when(githubClient.fetchReviewComments(anyString(), any())).thenReturn(Collections.emptyList());

        // We mock save to return the saved footprint
        when(footprintRepository.save(any(MissionFootprint.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        List<FootprintResponse> responses = footprintService.getFootprints();

        // Then
        // Verify GitHub Client is called
        verify(githubClient, atLeastOnce()).fetchPulls(anyString(), any());
        verify(footprintRepository, atLeastOnce()).save(any(MissionFootprint.class));

        FootprintResponse response = responses.stream()
                .filter(r -> r.getRepoName().equals("java-janggi"))
                .findFirst()
                .orElseThrow();
        assertThat(response.getRepoName()).isEqualTo("java-janggi");
    }
}
