package com.woowa.woowanews.news;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NewsController {

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
}
