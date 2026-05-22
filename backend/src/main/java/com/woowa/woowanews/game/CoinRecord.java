package com.woowa.woowanews.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "coin_record")
@Getter
@Setter
@NoArgsConstructor
public class CoinRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false)
    private int streak;

    @Column(nullable = false)
    private LocalDate recordedDate;
}
