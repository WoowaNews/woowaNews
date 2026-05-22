package com.woowa.woowanews.github;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class CrewMapService {

    private Map<String, String> mapping = new HashMap<>();

    @PostConstruct
    public void init() {
        try {
            ClassPathResource csvResource = new ClassPathResource("crew_members.csv");
            if (csvResource.exists()) {
                try (InputStream is = csvResource.getInputStream();
                     BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                    
                    String line;
                    // Skip header
                    br.readLine();
                    
                    while ((line = br.readLine()) != null) {
                        if (line.trim().isEmpty()) {
                            continue;
                        }
                        String[] parts = line.split(",");
                        if (parts.length >= 3) {
                            String githubId = parts[0].trim();
                            String nickname = parts[2].trim();
                            mapping.put(githubId, nickname);
                        }
                    }
                }
                System.out.println("Loaded " + mapping.size() + " mappings from crew_members.csv");
                return;
            }

            // Fallback to JSON
            ClassPathResource jsonResource = new ClassPathResource("github-crews.json");
            if (jsonResource.exists()) {
                ObjectMapper mapper = new ObjectMapper();
                try (InputStream is = jsonResource.getInputStream()) {
                    mapping = mapper.readValue(is, new TypeReference<Map<String, String>>() {});
                }
                System.out.println("Loaded " + mapping.size() + " mappings from github-crews.json");
            }
        } catch (Exception e) {
            System.err.println("Failed to load mappings: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public String getCrewName(String githubId) {
        if (githubId == null) {
            return "알수없음";
        }
        return mapping.getOrDefault(githubId, githubId);
    }
}
