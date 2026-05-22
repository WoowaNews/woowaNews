package com.woowa.woowanews.news;

import com.woowa.woowanews.comment.CommentRequest;
import com.woowa.woowanews.comment.CommentResponse;
import com.woowa.woowanews.comment.CommentService;
import com.woowa.woowanews.footprint.FootprintResponse;
import com.woowa.woowanews.footprint.FootprintService;
import com.woowa.woowanews.like.CrewLike;
import com.woowa.woowanews.like.CrewLikeService;
import com.woowa.woowanews.vote.LunchVoteResponse;
import com.woowa.woowanews.vote.LunchVoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class NewsController {

    private final FootprintService footprintService;
    private final LunchVoteService lunchVoteService;
    private final CrewLikeService crewLikeService;
    private final CommentService commentService;

    public NewsController(FootprintService footprintService,
                          LunchVoteService lunchVoteService,
                          CrewLikeService crewLikeService,
                          CommentService commentService) {
        this.footprintService = footprintService;
        this.lunchVoteService = lunchVoteService;
        this.crewLikeService = crewLikeService;
        this.commentService = commentService;
    }

    @GetMapping("/api/health")
    public HealthResponse health() {
        return new HealthResponse("ok");
    }

    @GetMapping("/api/newspaper")
    public NewspaperResponse newspaper() {
        return new NewspaperResponse(
                "Woowa News",
                LocalDate.now(),
                "우아한테크코스 8기 크루들을 위한 복고풍 데일리 신문"
        );
    }

    // 1. Footprint API
    @GetMapping("/api/footprint")
    public List<FootprintResponse> getFootprints() {
        return footprintService.getFootprints();
    }

    // 2. Sync API
    @GetMapping("/api/sync")
    public ResponseEntity<Map<String, String>> sync() {
        footprintService.syncAll();
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "GitHub footprint synced successfully.");
        return ResponseEntity.ok(response);
    }

    // 3. Lunch Vote API
    @GetMapping("/api/lunch-vote")
    public LunchVoteResponse getLunchVote() {
        return lunchVoteService.getVoteResults();
    }

    @PostMapping("/api/lunch-vote")
    public LunchVoteResponse postLunchVote(@RequestBody LunchVoteRequest request) {
        return lunchVoteService.vote(request.getMenuOption());
    }

    // 4. Crew Like API
    @GetMapping("/api/crew-like/{crewName}")
    public CrewLike getCrewLikes(@PathVariable String crewName) {
        return crewLikeService.getLikes(crewName);
    }

    @PostMapping("/api/crew-like/{crewName}")
    public CrewLike postCrewLike(@PathVariable String crewName) {
        return crewLikeService.like(crewName);
    }

    // 5. Comment API
    @GetMapping("/api/comments")
    public List<CommentResponse> getComments() {
        return commentService.findAll();
    }

    @PostMapping("/api/comments")
    public ResponseEntity<CommentResponse> postComment(@Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.create(request.content()));
    }

    // Request DTO for Lunch Vote
    public static class LunchVoteRequest {
        private String menuOption;

        public String getMenuOption() {
            return menuOption;
        }

        public void setMenuOption(String menuOption) {
            this.menuOption = menuOption;
        }
    }
}
