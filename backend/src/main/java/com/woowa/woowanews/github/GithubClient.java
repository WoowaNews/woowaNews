package com.woowa.woowanews.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class GithubClient {

    private final RestTemplate restTemplate;
    
    @Value("${github.api-url:https://api.github.com}")
    private String apiUrl;

    @Value("${github.token:}")
    private String token;

    public GithubClient() {
        this.restTemplate = new RestTemplate();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "WoowaNewsApp");
        headers.set("Accept", "application/vnd.github+json");
        if (token != null && !token.isEmpty() && !token.equals("NO_TOKEN")) {
            // Support both "ghp_" format directly or with Bearer/token prefix
            if (token.startsWith("Bearer ") || token.startsWith("token ")) {
                headers.set("Authorization", token);
            } else {
                headers.set("Authorization", "token " + token);
            }
        }
        return headers;
    }

    public List<GithubPull> fetchPulls(String repo, String cohortStartDateStr) {
        List<GithubPull> allPulls = new ArrayList<>();
        int page = 1;
        boolean hasMore = true;

        while (hasMore) {
            try {
                String url = apiUrl + "/repos/woowacourse/" + repo + "/pulls?state=all&per_page=100&page=" + page;
                HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
                ResponseEntity<GithubPull[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, GithubPull[].class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    GithubPull[] pulls = response.getBody();
                    if (pulls.length == 0) {
                        break;
                    }

                    for (GithubPull pull : pulls) {
                        // Compare created_at with cohortStartDate
                        if (pull.createdAt != null && pull.createdAt.compareTo(cohortStartDateStr) >= 0) {
                            allPulls.add(pull);
                        } else {
                            // Since GitHub pulls are returned sorted by created_at desc,
                            // if we hit one before cohortStartDate, we can stop fetching.
                            hasMore = false;
                        }
                    }

                    if (pulls.length < 100) {
                        break;
                    }
                    page++;
                } else {
                    break;
                }
            } catch (Exception e) {
                System.err.println("Error fetching pulls for repo " + repo + " page " + page + ": " + e.getMessage());
                break;
            }
        }
        return allPulls;
    }

    public GithubPullDetail fetchPullDetail(String repo, int number) {
        try {
            String url = apiUrl + "/repos/woowacourse/" + repo + "/pulls/" + number;
            HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
            ResponseEntity<GithubPullDetail> response = restTemplate.exchange(url, HttpMethod.GET, entity, GithubPullDetail.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error fetching pull detail for repo " + repo + " #" + number + ": " + e.getMessage());
        }
        return new GithubPullDetail(number, 0);
    }

    public List<GithubComment> fetchIssueComments(String repo, String cohortStartDateStr) {
        return fetchComments(repo, "issues/comments", cohortStartDateStr);
    }

    public List<GithubComment> fetchReviewComments(String repo, String cohortStartDateStr) {
        return fetchComments(repo, "pulls/comments", cohortStartDateStr);
    }

    private List<GithubComment> fetchComments(String repo, String path, String cohortStartDateStr) {
        List<GithubComment> allComments = new ArrayList<>();
        int page = 1;
        boolean hasMore = true;

        while (hasMore) {
            try {
                String url = apiUrl + "/repos/woowacourse/" + repo + "/" + path + "?since=" + cohortStartDateStr + "&per_page=100&page=" + page;
                HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
                ResponseEntity<GithubComment[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, GithubComment[].class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    GithubComment[] comments = response.getBody();
                    if (comments.length == 0) {
                        break;
                    }

                    allComments.addAll(Arrays.asList(comments));

                    if (comments.length < 100) {
                        break;
                    }
                    page++;
                } else {
                    break;
                }
            } catch (Exception e) {
                System.err.println("Error fetching comments for repo " + repo + " " + path + " page " + page + ": " + e.getMessage());
                break;
            }
        }
        return allComments;
    }

    // JSON parsing helper records/classes
    public static class GithubPull {
        public int number;
        public String state;
        public String title;
        @JsonProperty("created_at")
        public String createdAt;
        @JsonProperty("merged_at")
        public String mergedAt;
        public GithubUser user;
    }

    public static class GithubUser {
        public String login;
    }

    public static class GithubPullDetail {
        public int number;
        public int commits;

        public GithubPullDetail() {}
        public GithubPullDetail(int number, int commits) {
            this.number = number;
            this.commits = commits;
        }
    }

    public static class GithubComment {
        public GithubUser user;
        @JsonProperty("created_at")
        public String createdAt;
    }
}
