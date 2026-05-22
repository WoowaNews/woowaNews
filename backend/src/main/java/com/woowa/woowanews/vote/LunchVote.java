package com.woowa.woowanews.vote;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lunch_vote")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LunchVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String menuOption;

    @Column(nullable = false)
    private LocalDate voteDate;

    @Column(nullable = false)
    private LocalDateTime votedAt;
}
