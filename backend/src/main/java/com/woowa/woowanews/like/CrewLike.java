package com.woowa.woowanews.like;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "crew_like")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CrewLike {

    @Id
    private String crewName;

    private int likeCount;
}
