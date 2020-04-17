package com.wcms.retroboard.retroboard.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Point {

    @JsonProperty
    private Long id;

    @JsonProperty
    private String message;

    @JsonProperty
    private String sessionId;

    private List<Vote> votes = new ArrayList<>();

    public Point(Long id, String message, String sessionId) {
        this.id = id;
        this.message = message;
        this.sessionId = sessionId;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    @JsonGetter(value = "votes")
    public int getVotesCount() {
        return votes.size();
    }

    public void voteUp(String username) {
        //TODO add check if already maximum votes, probably need to redo the whole concept if Point - GroupOfPoints relationship for that
        votes.add(new Vote(username));
    }

    public void voteDown(String username) {
        Optional<Vote> first = votes.stream().filter(vote -> vote.voterUsername.equals(username)).findFirst();
        first.ifPresent(vote -> votes.remove(vote));
    }
}
