package com.woowa.woowanews.footprint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MissionFootprintRepository extends JpaRepository<MissionFootprint, Long> {
    Optional<MissionFootprint> findByRepoName(String repoName);
}
