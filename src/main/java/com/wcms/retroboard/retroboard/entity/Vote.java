package com.wcms.retroboard.retroboard.entity;

import java.util.Objects;

public class Vote {

    String voterUsername;

    public Vote(String voterUsername) {
        this.voterUsername = voterUsername;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vote vote = (Vote) o;
        return voterUsername.equals(vote.voterUsername);
    }

    @Override
    public int hashCode() {
        return Objects.hash(voterUsername);
    }
}
