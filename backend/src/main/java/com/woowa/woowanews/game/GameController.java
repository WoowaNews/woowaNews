package com.woowa.woowanews.game;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/reaction/ranking")
    public List<ReactionRecord> getReactionRanking() {
        return gameService.getReactionRanking();
    }

    @PostMapping("/reaction/ranking")
    public ResponseEntity<ReactionRecord> saveReactionRecord(@RequestBody ReactionRequest request) {
        return ResponseEntity.ok(gameService.saveReactionRecord(request.name(), request.avgMs()));
    }

    @GetMapping("/coin/ranking")
    public List<CoinRecord> getCoinRanking() {
        return gameService.getCoinRanking();
    }

    @PostMapping("/coin/ranking")
    public ResponseEntity<CoinRecord> saveCoinRecord(@RequestBody CoinRequest request) {
        return ResponseEntity.ok(gameService.saveCoinRecord(request.name(), request.streak()));
    }

    public record ReactionRequest(String name, int avgMs) {}
    public record CoinRequest(String name, int streak) {}
}
