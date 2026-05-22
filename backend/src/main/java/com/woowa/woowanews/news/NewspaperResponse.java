package com.woowa.woowanews.news;

import java.time.LocalDate;

public record NewspaperResponse(
        String title,
        LocalDate publishedDate,
        String description
) {
}
